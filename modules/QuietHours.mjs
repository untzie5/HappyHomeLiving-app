function quietHours(startHour = 23, endHour = 8) {
    return function (req, res, next) {
        const hours = new Date().getHours();

        const isQuietHours =
        hour >= startHour || hour <endHour;

       req.isQuietHours = isQuietHours;

       next();  
    };
}

export { quietHours };