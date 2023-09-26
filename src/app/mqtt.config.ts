import { IMqttServiceOptions } from 'ngx-mqtt';

export const connection: IMqttServiceOptions = {
    hostname: 'b3045d96ad1a4d06abf8b4ceb2245468.s1.eu.hivemq.cloud',
    port: 8884 ,
    path: '/mqtt',
    clean: true, // Retain session
    connectTimeout: 4000, // Timeout period
    reconnectPeriod: 4000, // Reconnect period
    // Authentication information
    // clientId: 'madQTT',
    username: 'admin',
    password: 'Password1234',
    protocol:'wss',
   }