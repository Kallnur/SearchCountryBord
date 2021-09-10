let name  = $('.search'),
	title = $('.title'),
	list  = $('.list');


let request = function(url){
	return new Promise((resolve, reject) => {
		$.ajax({
			method: 'GET',
			url: url,
		})
		.done(resolve)
		.fail(reject)
		.always(() => {
			$('.load').fadeOut(200)
		})
	})
};



function lineSearch(names){
	let option = [];

	for(let i of names){
		option.push(i);
		let item = $('<li class="opItem"></li>');
		item.text(i);
		item.addClass('hide')
		$('.option').append(item);
	}

	name.on('input', function(event){
		let entName = $(event.target).val();
		let items = $('.opItem');
		let newOption = [];

		if(entName != ''){
			for(let i=0; i<items.length; i++){
				if($(items[i]).text().search(entName) == -1){
					$(items[i]).addClass('hide');
				}
				else{
					$(items[i]).removeClass('hide');
				}
			}
		}else{$(items).addClass('hide')}
	})
}

function clickItem(){
	let list = $('.option');
	list.on('click', function(event){
		if(event.target.classList.contains('opItem')){
			let val = $(event.target).text();
			name.val(val);
			$('.opItem').addClass('hide');
			$(event.target).removeClass('hide')
		}
	})
}

function searchCoun(count) {
	let names = [];
	let entCount = [];
	for(let i = 0; i < count.length; i++){
		names.push(count[i].name);
	}
	//console.log(names);

	lineSearch(names);
	clickItem();
	
	$('#form').on('submit', function (event) {
		event.preventDefault();
		let entName = $(name).val();
		entCount = names.filter((elem) => {
			return elem == entName;
		})

		if($('.item')){$('.item').remove();}

		title.text(entCount[0]);

		for(let i = 0; i < count.length; i++){
			if(entCount == count[i].name){
				for(let j of count[i].borders){
					let item = $('<li class="item"></li>');
					let p    = $('<p>');
					item.append(p);
					let flag = $('<img src="" class="flag">');
					request('https://restcountries.eu/rest/v2/alpha/'+ j)
						.then((code) =>{
							$(flag).attr('src', code.flag);

							let name = code.name;
							p.text(name);
							return p;
						})
					list.append(item);
					item.append(flag);
				}
			}
		}
	})
}


request("https://restcountries.eu/rest/v2")
	.then((count) => {
		searchCoun(count);
	})
	.catch((error) => {
		let title = $('<h1>').text(`Произошла ошибка. Код ошибки: ${error.status}`);
 		alert(`Произошла ошибка`);
 		$('.container').prepend(title);
 		console.log(error);
	})
