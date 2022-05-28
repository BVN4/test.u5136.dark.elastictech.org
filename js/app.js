Vue.use(VueDraggable.default);

var app = new Vue({
	el: '#app',

	data: {
		username: '',
		list: {
			unselected: [],
			selected: []
		},
		options: {
			dropzoneSelector: '.friends-list',
			draggableSelector: '.user',
			excludeOlderBrowsers: true,
			multipleDropzonesItemsDraggingEnabled: true,
			showDropzoneAreas: true,
			onDrop: function(event){
				const area = document.querySelector('.item-dropzone-area');

				const i = event.items[0].getAttribute('index');
				const id = event.items[0].getAttribute('user');
				const target = event.droptarget.getAttribute('type');
				const owner = event.owner.getAttribute('type');

				if(target == owner || !app.list[owner][i] || app.list[owner][i].id != id) return;

				const index = area.nextElementSibling
					? area.nextElementSibling.getAttribute('index')
					: app.list[target].length;

				app.list[target].splice(index, 0, app.list[owner][i]);
				app.list[owner].splice(i, 1);
			}
		}
	},

	methods: {

		login: function(){
			VK.init({ apiId: 8179094 });
			VK.Auth.login(res => {
				if(!res.session) return alert('Необходима авторизация!');
				this.username = res.session.user.first_name + ' ' + res.session.user.last_name;

				VK.Api.call('friends.get', { fields: 'nickname,photo_50', v: '5.81' }, r => {
					this.list.unselected = [],
					this.list.selected = []

					for(let user of r.response.items){
						this.list.unselected.push({
							name: user.first_name + ' ' + user.last_name,
							img: user.photo_50,
							nickname: user.nickname,
							id: user.id
						});
					}

				});
			});
		},

		export2console: function(){
			let array = [];

			for(let user of this.list.selected){
				array.push({
					name: user.name,
					img: user.img,
					nickname: user.nickname,
					id: user.id
				})
			}

			console.log(array);
		}

	}

});
