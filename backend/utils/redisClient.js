const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config()

const redisClient= new Redis({
    host: 'redis-18890.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
    password: 'eiLoJOzW1vtO17DYekn2Lfwaxy1ZHCoT',
    port:18890
})

redisClient.on('connect',()=>{
  console.log('connected to redis')
})
redisClient.on('error',()=>{
  throw Error("couldn't connect to redis server")
})

module.exports = redisClient;
