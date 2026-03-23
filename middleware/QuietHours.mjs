function quietHours(startHour = 23, endHour = 8) {
    return (req, res, next) => {
        const hour = new Date().getHours();

        const isQuietHours =
        hour >= startHour || hour <endHour;

       req.isQuietHours = isQuietHours;

       next();  
    };
}

export { quietHours };