var cookieMonster = {
	cookies: function () { return Game.cookies },
	items: {
		cursor: {
			owned: function () { return Game.ObjectsById[0].bought },
			price: function () { return Game.ObjectsById[0].price },
			buy: function () { Game.ObjectsById[0].buy(); }
		},
		grandma: {
			owned: function () { return Game.ObjectsById[1].bought },
			price: function () { return Game.ObjectsById[1].price },
			buy: function () { Game.ObjectsById[1].buy(); }
		},
		farm: {
			owned: function () { return Game.ObjectsById[2].bought },
			price: function () { return Game.ObjectsById[2].price },
			buy: function () { Game.ObjectsById[2].buy(); }
		},
		factory: {
			owned: function () { return Game.ObjectsById[3].bought },
			price: function () { return Game.ObjectsById[3].price },
			buy: function () { Game.ObjectsById[3].buy(); }
		},
		mine: {
			owned: function () { return Game.ObjectsById[4].bought },
			price: function () { return Game.ObjectsById[4].price },
			buy: function () { Game.ObjectsById[4].buy(); }
		},
		shipment: {
			owned: function () { return Game.ObjectsById[5].bought },
			price: function () { return Game.ObjectsById[5].price },
			buy: function () { Game.ObjectsById[5].buy(); }
		},
		alchemyLab: {
			owned: function () { return Game.ObjectsById[6].bought },
			price: function () { return Game.ObjectsById[6].price },
			buy: function () { Game.ObjectsById[6].buy(); }
		},
		portal: {
			owned: function () { return Game.ObjectsById[7].bought },
			price: function () { return Game.ObjectsById[7].price },
			buy: function () { Game.ObjectsById[7].buy(); }
		},
		timeMachine: {
			owned: function () { return Game.ObjectsById[8].bought },
			price: function () { return Game.ObjectsById[8].price },
			buy: function () { Game.ObjectsById[8].buy(); }
		},
		antimatterCondenser: {
			owned: function () { return Game.ObjectsById[9].bought },
			price: function () { return Game.ObjectsById[9].price },
			buy: function () { Game.ObjectsById[9].buy(); }
		},
	},
	procedural: function () {
		// Will go through each item and buy them
		// Gets almost all achievements
		if (cookieMonster.items.cursor.owned() < 200) {
			if (cookieMonster.items.cookies > cookieMonster.items.cursor.price) {
				cookieMonster.buy.cursor();
			}
		} else if (cookieMonster.items.grandma.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.grandma.price) {
				cookieMonster.buy.grandma();
			}
		} else if (cookieMonster.items.farm.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.farm.price) {
				cookieMonster.buy.farm();
			}
		} else if (cookieMonster.items.factory.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.factory.price) {
				cookieMonster.buy.factory();
			}
		} else if (cookieMonster.items.mine.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.mine.price) {
				cookieMonster.buy.mine();
			}
		} else if (cookieMonster.items.shipment.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.shipment.price) {
				cookieMonster.buy.shipment();
			}
		} else if (cookieMonster.items.alchemyLab.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.alchemyLab.price) {
				cookieMonster.buy.alchemyLab();
			}
		} else if (cookieMonster.items.portal.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.portal.price) {
				cookieMonster.buy.portal();
			}
		} else if (cookieMonster.items.timeMachine.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.timeMachine.price) {
				cookieMonster.buy.timeMachine();
			}
		} else if (cookieMonster.items.antimatterCondenser.owned() < 100) {
			if (cookieMonster.items.cookies > cookieMonster.items.antimatterCondenser.price) {
				cookieMonster.buy.antimatterCondenser();
			}
		}
	},
	step: function () {
		var changeStep = true;

		$.each(Game.ObjectsById, function () {
			if (this.price < cookieMonster.config.stepSize + (cookieMonster.config.stepSize * cookieMonster.currentStep)) {
				if (cookieMonster.cookies() >= this.price) {
					this.buy();
				}
				changeStep = false;
			}
		});


		if (changeStep) {
			cookieMonster.currentStep++;
		}
	},
	efficiency: function () {
		if (Game.ObjectsById[cookieMonster.optimalBuilding()].price < cookieMonster.cookies()) {
			Game.ObjectsById[cookieMonster.optimalBuilding()].buy();
		}
	},
	// Based of http://pastebin.com/fzicJDNc
	// Tommi Kurki's Cookie Clicker Optimal Building Buyer Script!
	optimalBuilding: function () {
		cpc = Number.MAX_VALUE;
		var x = 0;

		for(i = Game.ObjectsById.length - 1; i >= 0; i--) {
			var me = Game.ObjectsById[i],
			    cpc2 = me.price / me.storedCps;

			if (cpc2 < cpc) {
				cpc = cpc2;
				x = i;
			}
		}

		return x;
	},
	buyUpgrades : function () {
		$.each(Game.UpgradesById, function () {
			if ($.inArray(this.id, cookieMonster.clickUpgrades)) {
				if (cookieMonster.cookies() > this.basePrice) {
					this.buy();
				}
			}
		});
	},
	config: {
		// Mode can be either 'step' or 'procedural'
		// step mode is more efficient (i think)
		mode: 'efficiency',

		// Step size if mode is step
		stepSize: 5000 
	},
	loop : function () {

		if (!cookieMonster.benchmark || (cookieMonster.benchmark && cookieMonster.getGameTime() < cookieMonster.benchmarkLength)) {
			// Click the cookie!
			Game.ClickCookie();

			// Click the golden cookie if it's there!
			Game.goldenCookie.click();

			// Buy click upgrades
			cookieMonster.buyUpgrades();

			// Run logic
			cookieMonster[cookieMonster.config.mode]();
		}

		if (cookieMonster.benchmark && cookieMonster.getGameTime() < cookieMonster.benchmarkLength) {
			console.log(Game.cookiesEarned);
			console.log(Game.cookiesPs);
			clearInterval(cookieMonster.instance);
		}

		// If an upgrade is available, take it!
		
		// $('#upgrades .upgrade.enabled').click();

	},
	currentStep: 0,
	instance: null,
	benchmark: false,
	benchmarkLength: 5,
	getGameTime: function () { return new Date(new Date().getTime() - Game.startDate).getMinutes();	},
	clickUpgrades: [0, 1, 2, 3, 4, 5, 6, 43, 75, 76, 77, 78, 82, 109, 119];
}

// Add helpers
$('#links').append(" | <a href='javascript:void(0)' class='toggleCookieMonster'>Cookie Monster</a>");
$('#game').prepend("<style type='text/css'>*:focus{outline:0}.cookieMonsterWindow{height:200px;width:500px;position:fixed;top:-200px;left:50%;margin-left:-250px;padding:10px;color:#FFF;z-index:9000000;transition:all 250ms ease-in-out;border-bottom-left-radius:6px;border-bottom-right-radius:6px;background:#333;border-left:1px #000 solid;border-right:1px #000 solid;border-bottom:1px #000 solid;box-sizing:border-box;background-image:url(img/darkNoise.png)}.cookieMonsterWindow.open{top:0;box-shadow:0 0 100px 0 #000,0 0 5px #000}.cookieMonsterWindow label,.cookieMonsterWindow input,.cookieMonsterWindow select{display:block}.cookieMonsterWindow label{margin-bottom:5px}.cookieMonsterWindow section{margin-bottom:15px}.cookieMonsterWindow select{border-radius:3px;border:1px darken(#FFF,30%) solid;font-size:18px;padding:5px;.box-shadow(inset 0 1px 2px rgba(0,0,0,0.25));min-width:150px}.cookieMonsterWindow select:focus{.box-shadow(inset 1px 2px 5px rgba(0,0,0,0.30))}</style> <div class='cookieMonsterWindow'> <section> <label for='cookieMonsterFps'>FPS (does not affect CpS)</label> <select class='fps' id='cookieMonsterFps'> <option value='30'>30</option> <option value='60'>60</option> <option value='120'>120</option> </select> </section> <section> <label for='cookieMonsterType'>Logic Type</label> <select class='type' id='cookieMonsterType'> <option value='procedural'>Procedural</option> <option value='step'>Step</option> <option value='efficiency'>Efficiency</option> </select> </section> <a class='option apply'>apply</a> <a class='option start'>start</a> <a class='option benchmark'>benchmark</a> <a class='option stop'>stop</a> </div>");

// Window open/close
$('body').on('click', 'a.toggleCookieMonster', function () {
	$('.cookieMonsterWindow').toggleClass('open');
});

// start bot
$('body').on('click', '.cookieMonsterWindow a.start', function () {
	Game.fps = parseInt($('.fps').val(), 10);
	cookieMonster.config.mode = $('.type').val();
	cookieMonster.instance = setInterval(cookieMonster.loop, 1);
});

// benchamrk bot
$('body').on('click', '.cookieMonsterWindow a.benchmark', function () {
	Game.fps = parseInt($('.fps').val(), 10);
	cookieMonster.config.mode = $('.type').val();
	cookieMonster.benchmark = true;
	Game.Reset();
	cookieMonster.instance = setInterval(cookieMonster.loop, 1);
});

// stop bot
$('body').on('click', '.cookieMonsterWindow a.stop', function () {
	clearInterval(cookieMonster.instance);
});

// apply settings
$('body').on('click', '.cookieMonsterWindow a.apply', function () {
	Game.fps = parseInt($('.fps').val(), 10);
	cookieMonster.config.mode = $('.type').val();
});

$.each(Game.UpgradesById, function () { 
	var desc = this.desc.toLowerCase();
	if (desc.indexOf('clicking') > -1 || desc.indexOf('mouse') > -1) {
		console.log(this.id)
	}
});