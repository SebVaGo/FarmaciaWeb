const useragent = require('useragent');
const geoip = require('geoip-lite');

const extractUserInfo = (req, res, next, err) => {
    try {

        //Extraer la ip del request
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        const geo = geoip.lookup(ip);
        const location = geo ? `${geo.city}, ${geo.country}` : 'Desconocido';

        //Extraer información del dispositivo
        const deviceInfo = useragent.parse(req.headers['user-agent']).device || 'Desconocido';

        console.log('IP:', ip);
        console.log('Location:', location);
        console.log('Device:', deviceInfo);

        req.userInfo= { ip, device : deviceInfo, location };

        next();
    }catch(error) {
        throw error;
    }
}

module.exports = { extractUserInfo };

