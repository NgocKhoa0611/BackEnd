const { Order } = require('../models');
const paymentRoutes = require('express').Router();
const querystring = require('qs');
const crypto = require('crypto');

function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort(); // Sắp xếp các key
    keys.forEach(key => {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    });
    return sorted;
}

paymentRoutes.post('/create_payment_url', async (req, res, next) => {
    try {

        const { default: dateFormat } = await import('dateformat');
        const secretKey = process.env.VNP_HASH_SECRET;

        if (!secretKey) {
            return res.status(500).json({ error: "VNP_HASH_SECRET is not set in environment variables" });
        }

        const { code: orderId, total_price: amount } = req.body;
        if (!orderId || !amount) {
            return res.status(400).json({ error: "Missing required fields: code or total_price" });
        }

        const ipAddr = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.socket?.remoteAddress;
        const date = new Date();
        const moment = require('moment-timezone');
        const createDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
        const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const returnUrl = 'http://localhost:8000/payment/callback';

        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: "A769O0T2",
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: 'Thanh toan hoa don',
            vnp_OrderType: 'billpayment',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
            vnp_BankCode: 'NCB'
        };

        vnp_Params = sortObject(vnp_Params);

        const signData = querystring.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;

        const redirectUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
        res.json({ redirectUrl });
    } catch (error) {
        next(error);
    }
});

paymentRoutes.get('/callback', async (req, res) => {
    try {
        const vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        if (!secureHash) {
            return res.json({ RspCode: '96', Message: 'Missing SecureHash' });
        }

        const sortedParams = sortObject(vnp_Params);
        const secretKey = process.env.VNP_HASH_SECRET;

        const signData = querystring.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const paymentDate = vnp_Params['vnp_PayDate'];
            const formattedPaymentDate = `${paymentDate.substring(0, 4)}-${paymentDate.substring(4, 6)}-${paymentDate.substring(6, 8)} ${paymentDate.substring(8, 10)}:${paymentDate.substring(10, 12)}:${paymentDate.substring(12, 14)}`;

            const [updatedRows] = await Order.update(
                { payment_date: formattedPaymentDate },
                { where: { code: orderId } }
            );

            if (updatedRows === 0) {
                return res.json({ RspCode: '99', Message: 'Order Not Found or Not Updated' });
            }

            return res.redirect(`http://localhost:5173/successpage`);
        } else {
            res.json({ RspCode: '97', Message: 'Invalid Signature' });
        }
    } catch (error) {
        console.error('Error in callback:', error.message);
        res.json({ RspCode: '99', Message: 'Internal Error' });
    }
});

paymentRoutes.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = paymentRoutes;
