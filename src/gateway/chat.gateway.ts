import {
  WSController,
  OnWSConnection,
  OnWSMessage,
  OnWSDisConnection,
  Inject,
  WSEmit,
  App,
} from '@midwayjs/core';
import { Context } from '@midwayjs/ws';
import { ILogger } from '@midwayjs/logger';
import { WebSocketService } from '../service/websocket.service';
import { Application } from '@midwayjs/ws';
import { randomUUID } from 'crypto';

@WSController()
export class ChatGateway {
  @Inject()
  ctx: Context;

  @Inject()
  logger: ILogger;
  
  @App('ws')
  wsApp: Application;

  @Inject()
  webSocketService: WebSocketService;
  
  // 存储连接ID
  private connectionId: string;

  // 客户端连接
  @OnWSConnection()
  async onConnectionMethod() {
    // 生成唯一连接ID
    this.connectionId = randomUUID();
    this.logger.info(`有新的连接：${this.ctx.readyState}, ID: ${this.connectionId}`);
    // 保存客户端连接
    this.webSocketService.addClient(this.connectionId, this.ctx);
  }

  // 接收客户端消息
  @OnWSMessage('message')
  @WSEmit('message') // 消息处理后广播给所有客户端
  async onMessage(data) {
    this.logger.info(`收到客户端消息类型: ${typeof data}`);
    
    try {
      // 特别处理Buffer类型数据
      let message = '';
      if (Buffer.isBuffer(data)) {
        message = data.toString('utf-8');
        this.logger.info(`从原生Buffer解析消息: ${message}`);
      } else if (data && data.type === 'Buffer' && Array.isArray(data.data)) {
        // 将Buffer对象转换为字符串
        message = Buffer.from(data.data).toString('utf-8');
        this.logger.info(`从Buffer对象解析消息: ${message}`);
      } else if (typeof data === 'string') {
        try {
          const parsedData = JSON.parse(data);
          message = parsedData.data?.message || parsedData.message || data;
        } catch (e) {
          message = data;
        }
      } else if (data && typeof data === 'object') {
        message = data.data?.message || data.message || JSON.stringify(data);
      } else {
        message = String(data);
      }
      
      const response = {
        message: message,
        from: this.connectionId,
        timestamp: new Date().toISOString(),
      };
      
      this.logger.info(`处理后的消息内容: ${message}`);
      this.logger.info(`发送响应: ${JSON.stringify(response)}`);
      
      // 广播消息给所有客户端
      this.webSocketService.broadcastMessage('message', response);
      
      return response;
    } catch (error) {
      this.logger.error(`处理消息错误: ${error.message}`);
      return {
        error: `消息处理失败: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // 接收心跳消息
  @OnWSMessage('ping')
  @WSEmit('pong')
  async onPing(data) {
    this.logger.info(`收到心跳检测，客户端ID: ${this.connectionId}`);
    
    try {
      // 处理Buffer类型数据
      if (Buffer.isBuffer(data)) {
        const pingMessage = data.toString('utf-8');
        this.logger.info(`从原生Buffer解析心跳: ${pingMessage}`);
      } else if (data && data.type === 'Buffer' && Array.isArray(data.data)) {
        const pingMessage = Buffer.from(data.data).toString('utf-8');
        this.logger.info(`从Buffer对象解析心跳: ${pingMessage}`);
      } else if (data) {
        this.logger.info(`心跳数据: ${typeof data}, 内容: ${JSON.stringify(data)}`);
      }
      
      return {
        message: 'pong',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`处理心跳错误: ${error.message}`);
      return {
        message: 'pong',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // 客户端断开连接
  @OnWSDisConnection()
  async onDisConnection() {
    this.logger.info(`客户端断开连接：${this.connectionId}`);
    // 清理已断开的客户端连接
    this.webSocketService.removeClient(this.connectionId);
  }
}
