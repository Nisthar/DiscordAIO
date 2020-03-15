#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const inquirer = require('inquirer')
const figlet = require('figlet')
const Discord = require("discord.js");
const axios = require('axios').default;
const request = require('request')

clear()
console.log(
    chalk.blueBright(
        figlet.textSync('DiscordAIO', {horizontalLayout: 'fitted' })
    ),
)
console.log(
    chalk.blue(' powered by Sentox#2002')
)

console.log(
    chalk.blueBright(' -----------------------------------------------------------')
)

console.log(
    chalk.blue(' Using this tool can result in your account getting banned!'),
)

console.log(
    chalk.blue(' If the program sends too many requests in a short time interval, ')
)

console.log(
    chalk.blue(' it is very likely you could be banned! Use this program only ')
)

console.log(
    chalk.blue(' if you understand the risks involved!')
)
console.log(
    chalk.blueBright(' -----------------------------------------------------------')
)
const initChoices = [
    {
        type: 'list',
        name: 'action',
        message: chalk.blue('Please select an action:'), 
        choices: ['Auto Invite Joiner','Auto Nitro Claimer'],    
    }
]


const accountTokenQuestion = [
    {
        type: 'input',
        name: 'accounttoken',
        message: chalk.blue('Please enter your account token:'), 
        validate: (input) => {
            return new Promise((resolve, reject) => {
                if (!input.length) {
                    reject(chalk.red('[Error] Please provide a account token'))
                }
                resolve(true)
            })
        }
    }
]


;(async () => {
    this.autoInviteJoiner = autoInviteJoiner
    this.autoNitroClaimer = autoNitroClaimer

    const menueChoices = await inquirer.prompt(initChoices)

    await this[menueChoices.action.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())]()

    async function autoInviteJoiner() {
        const {accounttoken} = await inquirer.prompt(accountTokenQuestion)
        console.log(
            chalk.green(`Provided account token: ${accounttoken}`)
        )
        const client = new Discord.Client();

        client.on('ready', () => {
            console.log(
                chalk.blue(`[${client.user.tag}] Monitoring for Server Invites ...`)
            )
        });
        
        client.on('message', message => {
            if(message.content.includes('discord.gg/')){

                console.log(
                    chalk.green(`[${client.user.tag}] Invite found in ${message.guild.name}`)
                );

                var inviteCode = message.content.split('.gg/')[1];
       
                console.log(inviteCode)

                var requestResponse = request.post({
                    url: `https://discordapp.com/api/v6/invites/${inviteCode}`,
                    headers: 
                    {
                    'Authorization': accounttoken,
                    },
                })
              

                if (requestResponse.status_code == 200) {
                    console.log(
                        chalk.green(`[${client.user.tag}] Successfully joined!`)
                    )
                } else {
                    console.log(
                        chalk.red('[ERROR] - Failed to join Server')
                    )
                }
            }
        })
        
        client.login(accounttoken)
        .catch(error => {
            if(error.code == 4004) {
                console.log(`${chalk.red('[ERROR]')} - Invalid token`)

                
            } else {
                console.log(`${chalk.red('[ERROR]')} - ${error}`)
            }
        })
    }




    async function autoNitroClaimer () {
        const {accounttoken} = await inquirer.prompt(accountTokenQuestion)
        console.log(
            chalk.green(`Provided account token: ${accounttoken}`)
        )
        const client = new Discord.Client();

        client.on('ready', () => {
            console.log(
                chalk.yellow(`[${client.user.tag}] Monitoring Discord Servers for Nitro Gifts ...`)
            )
        });
        
        client.on('message', message => {
            if(message.content.includes('discord.gift') || message.content.includes('discordapp.com/gifts/')) {
        
                var Nitro = /(discord\.(gift)|discordapp\.com\/gift)\/.+[a-z]/
        
                var NitroUrl = Nitro.exec(message.content);
                var NitroCode = NitroUrl[0].split('/')[1];
        
                console.log(
                    chalk.greenBright(`Nitro found in ${message.guild.name}`)
                );
                
                axios({
                    method: 'POST',
                    url: `https://discordapp.com/api/v6/entitlements/gift-codes/${NitroCode}/redeem`, 
                    headers: 
                    {
                    'Authorization': client.account_token 
                    }
                }).then(
                    () => console.log(
                        chalk.green(`Successfull redeemed on ${message.guild.name}`)
                    )
                ).catch(ex => console.log(`Error | Failed to claim Nitro`))
            }
        })
        
        client.login(accounttoken)
        .catch(error => {
            if(error.code == 4004) {
                console.log(`${chalk.red('[ERROR]')} - Invalid token`)

                
            } else {
                console.log(`${chalk.red('[ERROR]')} - ${error}`)
            }
        })
    }
})()
