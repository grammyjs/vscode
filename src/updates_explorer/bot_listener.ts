import { Bot } from "grammy";
import type { Message, Update } from "grammy/types";

export class BotListener {
  private token: string;

  private error: Error | undefined;

  private jsonData: (Message & Update.NonChannel) | undefined;

  constructor(botToken: string) {
    this.token = botToken;
  }

  public async startListeningToUpdates(
    onDataReceived: (data: Message & Update.NonChannel) => void
  ) {
    try {
      const bot = this.getBotInstance();

      bot.use(async (ctx) => {
        const hasDownload = ctx.has(":file");
        const url = hasDownload
          ? await ctx.getFile().then((file) => ({
              url: `https://api.telegram.org/file/bot${this.token}/${file.file_path}`,
            }))
          : {};
        const decoratedUpdate = {
          ...ctx.update,
          type:
            Object.keys(ctx.update).filter((key) => key !== "update_id")[0] ??
            "unknown",
          timestamp: new Date(),
          hasDownload,
          ...url,
        };
        // console.log(decoratedUpdate.message);
        this.jsonData = decoratedUpdate.message;
        if (this.jsonData !== undefined) {
          onDataReceived(this.jsonData);
        }
      });

      await bot.api.getMe();
      await bot.init();
      await bot.start({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        allowed_updates: [
          "message",
          "edited_message",
          "channel_post",
          "edited_channel_post",
          "inline_query",
          "chosen_inline_result",
          "callback_query",
          "shipping_query",
          "pre_checkout_query",
          "poll",
          "poll_answer",
          "my_chat_member",
          "chat_member",
          "chat_join_request",
        ],
        onStart: async () => {},
      });
    } catch (err) {}
  }

  public async stopListeningToUpdates() {
    await this.getBotInstance().stop();
  }

  public get botError() {
    return this.error;
  }

  private getBotInstance() {
    return new Bot(this.token);
  }
}
