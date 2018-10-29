var botBuilder = require('claudia-bot-builder');
const axios = require('axios');
const telegramTemplate = botBuilder.telegramTemplate;
const Semaphore = require('./statuses');
const util = require('util');
const statsObj = new Semaphore();
var stats = statsObj.getObj();
var projectName = '';
var chatId = '';

module.exports = botBuilder(function (message) {	
	if (message.type === 'telegram') {	
	console.log(process.env.IP_DEPLOY);
	console.log(util.inspect(process.env, false, null, true /* enable colors */))
	//console.log(message.originalRequest.message.voice);
		if(message.text == "Exit" || message.text == "exit" || message.text == "esci" || message.text == "Esci"){
			stats.step = 0;
			stats.chatId = 0;
			stats.projectName = '';
		} 
	//console.log(message);
		switch (true) {			
            case (stats.step === 0): {
				if(message.originalRequest.message.from.username == "Fearuin" || message.originalRequest.message.from.username == "claudiocampisi" || message.originalRequest.message.from.username == "michelecarbone"){
					//if(message.text != ""){
						stats.chatId = message.originalRequest.message.chat.id;
						stats.step = 1;
						return [
							new telegramTemplate.ChatAction('typing').get(),
							new telegramTemplate.Pause(300).get(),
							'Ciao ' + message.originalRequest.message.from.first_name + '!', 
							new telegramTemplate.ChatAction('typing').get(),
							new telegramTemplate.Pause(300).get(),
							new telegramTemplate.Text('Cosa vorresti fare?')
								.addInlineKeyboard([
									[{
										text: 'Deploy',
										callback_data: 'deploy'
									}],
									[{
										text: 'Monitoring',
										callback_data: 'monitoring'
									}],
									[{
										text: 'User Engagement',
										callback_data: 'user_engagement'
									}]
								])
								.get()
						];
				}else{
					return 'Siamo spiacenti, lei non è autorizzato per usare questo bot';
				}
			}
			case (stats.step === 1 && message.text === 'deploy'): {
				stats.toDo = message.text;
				stats.step = 2;
					return [						
						new telegramTemplate.ChatAction('typing').get(),
						new telegramTemplate.Pause(300).get(),
						new telegramTemplate.Text('Quale progetto desideri deployare?')
							.addInlineKeyboard([
								[{
									text: 'OSday',
									callback_data: 'osday'
								}],
								[{
									text: 'SNESEmu',
									callback_data: 'SNESEmu'
								}]
							])
							.get()
					];
			}
			case (stats.step === 1 && message.text === 'monitoring'): {
				stats.toDo = message.text;
				stats.step = 2;
					return [						
						new telegramTemplate.ChatAction('typing').get(),
						new telegramTemplate.Pause(300).get(),
						new telegramTemplate.Text('Quale progetto desideri monitorare?')
							.addInlineKeyboard([
								[{
									text: 'OSday',
									callback_data: 'osday'
								}],
								[{
									text: 'SNESEmu',
									callback_data: 'SNESEmu'
								}]
							])
							.get()
					];
			}
			case (stats.step === 1 && message.text === 'user_engagement'): {
				stats.toDo = message.text;
				stats.step = 2;
					return [						
						new telegramTemplate.ChatAction('typing').get(),
						new telegramTemplate.Pause(300).get(),
						new telegramTemplate.Text('Quale progetto desideri essere notificato?')
							.addInlineKeyboard([
								[{
									text: 'OSday',
									callback_data: 'osday'
								}],
								[{
									text: 'SNESEmu',
									callback_data: 'SNESEmu'
								}]
							])
							.get()
					];
			}
			case (stats.step === 2): {
				if(message.text === 'osday' || message.text === 'SNESEmu'){
					stats.step = 3;
					stats.projectName = message.text;
						return [						
							new telegramTemplate.ChatAction('typing').get(),
							new telegramTemplate.Pause(300).get(),
							new telegramTemplate.Text('In che ambiente?')
								.addInlineKeyboard([
									[{
										text: 'DEV',
										callback_data: 'DEV'
									}],
									[{
										text: 'UAT',
										callback_data: 'UAT'
									}],
									[{
										text: 'PROD',
										callback_data: 'PROD'
									}],
								])
								.get()
						];
				}else{
					return [
						new telegramTemplate.ChatAction('typing').get(),
                        new telegramTemplate.Pause(300).get(),
                        'Errore! Scegli tra le proposte fornite ...',
						new telegramTemplate.ChatAction('typing').get(),
						new telegramTemplate.Pause(300).get(),
						new telegramTemplate.Text('Quale progetto desideri deployare?')
							.addInlineKeyboard([
								[{
									text: 'OSday',
									callback_data: 'osday'
								}],
								[{
									text: 'SNESEmu',
									callback_data: 'SNESEmu'
								}]
							])
							.get()
					];
				}
			}
			case (stats.step === 3): {
				if(stats.toDo == 'deploy'){
					if((message.text === 'DEV' || message.text === 'UAT' || message.text === 'PROD')){					
						stats.step = 4;
						var s = '';					
						return [						
							new telegramTemplate.ChatAction('typing').get(),
							new telegramTemplate.Pause(300).get(),
							new telegramTemplate.Text('Sei sicuro di voler deployare il progetto ' + stats.projectName + ' in ambiente ' + message.text +'?')
								.addInlineKeyboard([
									[{
										text: 'Si',
										callback_data: 'si'
									}],
									[{
										text: 'No',
										callback_data: 'no'
									}]
								])
								.get()
						];
					}else{
						return [
							new telegramTemplate.ChatAction('typing').get(),
							new telegramTemplate.Pause(300).get(),
							'Errore! Scegli tra le proposte fornite ...',
							new telegramTemplate.ChatAction('typing').get(),
							new telegramTemplate.Pause(300).get(),
							new telegramTemplate.Text('In che ambiente?')
								.addInlineKeyboard([
									[{
										text: 'DEV',
										callback_data: 'DEV'
									}],
									[{
										text: 'UAT',
										callback_data: 'UAT'
									}],
									[{
										text: 'PROD',
										callback_data: 'PROD'
									}],
								])
								.get()
						];
					}
				}else{
					stats.step = 4;	
				}
			}
			case (stats.step === 4): {
				if(message.text === 'si' && stats.toDo == 'deploy'){
					stats.step = 5;
					console.log(stats.chatId);
					var url = 'http://' + process.env.IP_DEPLOY + '/job/'+ stats.projectName + '-pipeline/buildWithParameters?token=123&telegramChatId=' + stats.chatId;
					console.log(url);
					const instance = axios.create({
						headers: {
						  'Authorization': process.env.B_AUTH,
						  'Content-Type': 'application/json'
						  }
					});
					return instance.get(url).then(function (response) {
							console.log(response);
							return 'Richiesta di deploy inviata con successo'
						}).catch(error => {return 'Error ' + error.statusCode + ': ' + error.statusMessage});			
				}else if(stats.toDo == 'monitoring'){
					stats.step = 5;
					//console.log(stats.chatId);
					var url = 'http://'+ process.env.IP_MONITORING +'/kie-server/services/rest/server/containers';
					console.log(url);
					const instance = axios.create({
						headers: {
						  'Authorization': process.env.B_AUTH_M,
						  'Content-Type': 'application/json'
						  }
					});
					return instance.get(url).then(function (response) {
							//console.log(response);							
							var s = '';
							var tmpContainer = response.data.result['kie-containers'];
							if(tmpContainer['kie-container'].length == 0){
								return 'Nessun progetto da monitorare';
							}else{
								for(var i = 0; i < tmpContainer['kie-container'].length; i++){
									s += tmpContainer['kie-container'][i]['container-id'] + ' ' + tmpContainer['kie-container'][i].status + '\n';
								}
							}
							return s;
						}).catch(error => {return 'Error ' + error.statusCode + ': ' + error.statusMessage});	
				}else if(stats.toDo == 'user_engagement'){
					stats.step = 5;
					console.log('user_engagement chatId: ' + stats.chatId);
					var url = 'http://' + process.env.IP_MONITORING + '/osday-notifier/service/rest/register/project/' + stats.projectName;
					console.log(url);
					const instance = axios.create({});
					return instance.post(url, {
							projectName: stats.projectName,
							chatId: stats.chatId
						}).then(function (response) {
							console.log(response);
							return 'Ok';
						}).catch(error => {return 'Error ' + error.statusCode + ': ' + error.statusMessage});	
				}else if(message.text === 'no'){
					stats.step = 1;
					stats.projectName = '';
					stats.chatId = 0;
					return [
						new telegramTemplate.ChatAction('typing').get(),
						new telegramTemplate.Pause(300).get(),
						new telegramTemplate.Text('Cosa vorresti fare?')
							.addInlineKeyboard([
								[{
									text: 'Deploy',
									callback_data: 'deploy'
								}],
								[{
									text: 'Monitoring',
									callback_data: 'monitoring'
								}],
								[{
									text: 'User Engagement',
									callback_data: 'user_engagement'
								}]
								
							])
							.get()
				];
				}else{
					return [
						new telegramTemplate.ChatAction('typing').get(),
                        new telegramTemplate.Pause(300).get(),
                        'Errore! Scegli tra le proposte fornite ...',
						new telegramTemplate.ChatAction('typing').get(),
						new telegramTemplate.Pause(300).get(),
						new telegramTemplate.Text('Sei sicuro di voler deployare il progetto ' + stats.projectName + ' in ambiente ' + message.text +'?')
							.addInlineKeyboard([
								[{
									text: 'Si',
									callback_data: 'si'
								}],
								[{
									text: 'No',
									callback_data: 'no'
								}]
							])
							.get()
				];
				}
			}
			case (stats.step === 5): {
				stats.step = 1;
				stats.projectName = '';
				return [
						new telegramTemplate.ChatAction('typing').get(),
						new telegramTemplate.Pause(300).get(),
						new telegramTemplate.Text('Cosa vorresti fare?')
							.addInlineKeyboard([
								[{
									text: 'Deploy',
									callback_data: 'deploy'
								}],
								[{
									text: 'Monitoring',
									callback_data: 'monitoring'
								}],
								[{
									text: 'User Engagement',
									callback_data: 'user_engagement'
								}]
							])
							.get()
				];
			}
		}			
	}
});