const arrMsgUsers = [];	
let itemsLugares = [];	
let arrLugares = [];
let lugar = "";
let comprobarMensaje = true
let comprobarLugar = true
let dicMensajeLugares = {
	plaza: 'park',
	hospital: 'hospital',
	gimnasio: 'gym',
	banco: 'bank'
}
let palabraBuscarLugar = ""
$('.usrInput').on('keyup keypress', function (e) {
	var keyCode = e.keyCode || e.which;
	var text = $(".usrInput").val();
	let arrText = []
	if (keyCode === 13) {
		if (text == "" || $.trim(text) == '') {//trim elimina espacios demas
			e.preventDefault();
			return false;
		} else {
			arrText = text.split(' ')
			var lugares = Object.keys(dicMensajeLugares).map(function(key) {
				return [key,dicMensajeLugares[key]]
			});
			Object.values(lugares).forEach(([key, value]) => {
				arrLugares.push(key)
			})
			for(let l in arrLugares)
			{
				for(let y in arrText)
				{
					if(arrLugares[l] == arrText[y])
					{
						console.log("Coincidencia en: ", arrLugares[l])
						comprobarLugar = true;
						palabraBuscarLugar = arrLugares[l];
						lugar = arrLugares[l]
						break;
					}else
						comprobarLugar = false;
				}
				if(comprobarLugar)
					break;
			}
			palabraBuscarLugar = dicMensajeLugares[palabraBuscarLugar]
			if(!comprobarLugar){
				if(comprobarMensaje){
					$(".usrInput").blur();
					arrMsgUsers.push(text)
					var ultimoMsj = arrMsgUsers[arrMsgUsers.length - 1];
					setUserResponse(ultimoMsj);
					send(ultimoMsj);
					e.preventDefault();
					return false;
				}else{/// Entra solo cuando no entiende, aca le enseñamos
					$(".usrInput").blur();
					arrMsgUsers.push(text)
					var ultimoMsj = arrMsgUsers[arrMsgUsers.length - 1];
					setUserResponse(ultimoMsj);
					Aprender(ultimoMsj);
					comprobarMensaje=true;
					return false;
				}
			}else{
				$(".usrInput").blur();
				arrMsgUsers.push(text)
				var ultimoMsj = arrMsgUsers[arrMsgUsers.length - 1];
				setUserResponse(ultimoMsj);
				console.log(palabraBuscarLugar)
				fetch('http://localhost:5050/buscarLugar', {
					method: 'POST',
					body: JSON.stringify({
					  "type": palabraBuscarLugar,
					}),
			  	})
				  var botEsperadoLugares = "Dame un segundo que estoy buscando chabon"
				  var a = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + botEsperadoLugares + '</p><div class="clearfix"></div>';
				  $(a).appendTo('.chats').hide().fadeIn(1000);
				setTimeout(()=>{ 
				fetch('http://localhost:5050/apiansw')
				  .then(response => response.json())
				  .then(data => {
					data.forEach(item => {
						itemsLugares.push({
							name: item.name,
							address: item.address,
							rating: item.rating
						})
					})
					console.log(itemsLugares)
					// addressLugar = itemsLugares[0].address.split(',')
					var respuestaBotLugar_string = "Podes fijarte en visitar el "+ lugar +" "+ itemsLugares[0].name  +" que está en "
					+ itemsLugares[0].address
					var respuestaBotLugar = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + respuestaBotLugar_string + '</p><div class="clearfix"></div>';
					$(respuestaBotLugar).appendTo('.chats').hide().fadeIn(1000);
				})}, 15000);
				itemsLugares = []
			}
		}
	}
});


// Mostrar respuesta de usuario
function setUserResponse(val) {
	var UserResponse = '<img class="userAvatar" src=' + "./static/img/userAvatar.jpg" + '><p class="userMsg">' + val + ' </p><div class="clearfix"></div>';
	$(UserResponse).appendTo('.chats').show('slow');
	$(".usrInput").val('');
	scrollToBottomOfResults();
	$('.suggestions').remove();
}

// Scroll automÃ¡tico en el chat
function scrollToBottomOfResults() {
	var terminalResultsDiv = document.getElementById('chats');
	terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

function send(message) {
	console.log("Mensaje de usuario:", message)

	$.ajax({
		url: 'http://localhost:5005/webhooks/rest/webhook',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			"message": message,
			"sender": "Me"
		}),
		success: function (data, textStatus) {
			if(data != null){
				setBotResponse( data, message);

			}
			console.log("Rasa Response: ", data, "\n Status:", textStatus)
		}
	});
}

function newIntent(message) {
	console.log("mensaje a enviar a la api: " + message)
	fetch('http://localhost:8080/intent', {
		method: 'POST',
		body: JSON.stringify({
			"message": message,
		}),
	})
}

	// Mostrar respuesta del bot
function setBotResponse(val, message) {
	console.log(val)
	setTimeout(function () {
		if (val.length < 1) {

			msg = 'I couldn\'t get that. Let\' try something else!';

			var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + msg + '</p><div class="clearfix"></div>';
			$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
			
			newIntent(message);
			comprobarMensaje=false;
		} else {
			//if we get response from Rasa
			for (i = 0; i < val.length; i++) {
				//check if there is text message
				if (val[i].hasOwnProperty("text")) {
					var BotResponse = '<img class="botAvatar" src="./static/img/botAvatar.png"><p class="botMsg">' + val[i].text + '</p><div class="clearfix"></div>';
					$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
				}

				//check if there is image
				if (val[i].hasOwnProperty("image")) {
					var BotResponse = '<div class="singleCard">' +
						'<img class="imgcard" src="' + val[i].image + '">' +
						'</div><div class="clearfix">'
					$(BotResponse).appendTo('.chats').hide().fadeIn(1000);
				}

				//check if there is  button message
				if (val[i].hasOwnProperty("buttons")) {
					addSuggestion(val[i].buttons);
				}

			}
			scrollToBottomOfResults();
		}

	}, 500);
}

// Minimizar Maximizar chat (borrar)
$('#profile_div').click(function () {
	$('.profile_div').toggle();
	$('.widget').toggle();
	scrollToBottomOfResults();
});

$('#close').click(function () {
	$('.profile_div').toggle();
	$('.widget').toggle();
});
function Aprender(message){
    fetch('http://localhost:8080/nuevo-intent', {
        method: 'POST',
        body: JSON.stringify({
            "message": message,
        }),
    })
}