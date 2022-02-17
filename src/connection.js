const { Pool } = require('pg');
const pool = new Pool({
    connectionString: "postgres://bznkpegeowwqaf:1430e0340808af1d579f80da831f766cf63b280bcd8c946ffde181fc5374aac6@ec2-54-220-170-192.eu-west-1.compute.amazonaws.com:5432/d7i4pv9ie2cu5p",
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;