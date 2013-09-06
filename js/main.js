/*global jQuery, _, List, featuredList */
(function ($) {
	'use strict';

	var API_URL = 'https://bower-component-list.herokuapp.com';

	function shuffle(array) {
		var tmp, current, top = array.length;

		if (top) while(--top) {
			current = Math.floor(Math.random() * (top + 1));
			tmp = array[current];
			array[current] = array[top];
			array[top] = tmp;
		}

		return array;
	}

	function render(data) {
		var listInit = true;

		var sortedByCreated = _.sortBy(data, function (el) {
			return -Date.parse(el.created);
		}).filter(function (el) {
			return el.description && el.description.trim() !== '';
		});

		var featuredTpl = _.template($('#components-small-template').html(), {
			title: 'Featured components',
			components: featuredList
		});

		var hotTpl = _.template($('#components-small-template').html(), {
			title: 'Hot components',
			components: _.sortBy(sortedByCreated.slice(0, 50), function (el) {
				return -el.stars;
			}).slice(0, 5)
		});

		var latestTpl = _.template($('#components-small-template').html(), {
			title: 'Latest components',
			components: sortedByCreated.slice(0, 5)
		});

		var randomTpl = _.template($('#components-small-template').html(), {
			title: 'Random components',
			components: shuffle(sortedByCreated).slice(0, 5)
		});

		var componentsTpl = _.template($('#components-template').html(), {
			components: _.sortBy(data, function (el) {
				return -el.stars;
			})
		});

		$('#loading').hide();
		$('.components1').append(featuredTpl).append(hotTpl);
		$('.components2').append(latestTpl).append(randomTpl);
		$('.components3').append(componentsTpl).find('.search').show();

		var list = new List('components', {
			valueNames: [
				'name',
				'description',
				'owner',
				'created',
				'updated',
				'forks',
				'stars'
			],
			page: 10,
			indexAsync: true,
			plugins: [[
				'paging', {
					outerWindow: 1
				}
			]]
		});

		list.on('updated', function () {
			$('#components').find('.created time, .updated time').timeago();

			if (listInit) {
				listInit = false;
				var query = decodeURIComponent(window.location.hash.replace('#!/search/', ''));

				if (query) {
					$('.search').val(query);
					list.search(query);
				}

				// back/forward in the list with arrow-keys
				$(window).on('keyup', function (e) {
					// ugly hack to prevent pagination when search is focused
					// easiest way, since I don't control this logic
					if ($(document.activeElement).is('.search')) {
						return;
					}

					var pageBtns = $('#components').find('.paging li');

					if (e.which === 37) {
						pageBtns.filter('.prev').click();
					}

					if (e.which === 39) {
						pageBtns.filter('.next').click();
					}
				});
			} else {
				// update hash on search
				var query = $.trim($('.search').val());
				window.location.hash = query === '' ? '' : '#!/search/' + query;
			}

			$('.table thead').toggle(list.matchingItems.length !== 0);
			$('#search-notfound').toggle(list.matchingItems.length === 0);
		});

		$('.profile img').on('mouseover mouseout', function (e) {
			$(this).toggleClass('animated tada', e.type === 'mouseover');
		});
	}

	$(function () {
		$.getJSON(API_URL).then(render).fail(function () {
			$('#loading p').text('Failed to load component list :(');
		});
	});
})(jQuery);
