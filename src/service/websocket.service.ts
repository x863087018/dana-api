import { Provide, Scope, ScopeEnum, Init, Inject } from '@midwayjs/core';
import { ILogger } from '@midwayjs/logger';
import { Context } from '@midwayjs/ws';

@Provide()
@Scope(ScopeEnum.Singleton)
export class WebSocketService {
  // 存储所有的WebSocket连接
  private clients: Map<string, Context> = new Map();
  
  @Inject()
  logger: ILogger;

  @Init()
  async init() {
    this.logger.info('WebSocket服务初始化');
  }

  /**
   * 添加新的客户端连接
   * @param id 客户端ID
   * @param ctx WebSocket上下文
   */
  addClient(id: string, ctx: Context) {
    this.clients.set(id, ctx);
    this.logger.info(`添加客户端: ${id}, 当前连接数: ${this.clients.size}`);
    return true;
  }

  /**
   * 移除客户端连接
   * @param id 客户端ID
   */
  removeClient(id: string) {
    if (this.clients.has(id)) {
      this.clients.delete(id);
      this.logger.info(`移除客户端: ${id}, 当前连接数: ${this.clients.size}`);
      return true;
    }
    return false;
  }

  /**
   * 获取所有客户端
   */
  getAllClients() {
    return this.clients;
  }

  /**
   * 获取客户端连接数量
   */
  getClientCount() {
    return this.clients.size;
  }

  /**
   * 向所有客户端广播消息
   * @param event 事件名称
   * @param data 消息内容
   */
  broadcastMessage(event: string, data: any) {
    for (const [id, client] of this.clients.entries()) {
      try {
        if (client.readyState === 1) { // OPEN
          client.send(event, data);
        }
      } catch (error) {
        this.logger.error(`向客户端 ${id} 发送消息失败:`, error);
      }
    }
  }

  /**
   * 向特定客户端发送消息
   * @param clientId 客户端ID
   * @param event 事件名称
   * @param data 消息内容
   */
  sendToClient(clientId: string, event: string, data: any) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === 1) {
      try {
        client.send(event, data);
        return true;
      } catch (error) {
        this.logger.error(`向客户端 ${clientId} 发送消息失败:`, error);
      }
    }
    return false;
  }
}
