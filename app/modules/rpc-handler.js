"use strict";

let DiscordRPC = require("discord-rpc");

class RPCHandler {
	constructor(rpcClientId, isEnabled){
		DiscordRPC.register(rpcClientId);
		this.rpcClientId = rpcClientId;
		this.rpc = new DiscordRPC.Client({ transport: "ipc" });
		this.isEnabled = isEnabled;
	}

	rpcEnabled(){
		return this.isEnabled;
	}

	async update(activity){
		await this.rpc.setActivity(activity).catch(console.error);
	}

	async start(){
		if (!this.isEnabled) return;
		await this.rpc.login({ clientId: this.rpcClientId }).catch(console.error);
		this.rpc.on("ready", () => console.log("Discord RPC ready"));
	}

	async end(){
		await this.rpc.clearActivity();
		return this.rpc.destroy();
	}
}

module.exports = RPCHandler;
