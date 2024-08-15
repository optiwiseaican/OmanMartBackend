const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();


const PORT = process.env.PORT || 5021;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
