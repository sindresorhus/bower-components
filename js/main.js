/*global jQuery, _, List */
(function ($) {
	'use strict';

	var API_URL = 'http://bower-component-list.herokuapp.com/';

	function render(data) {
		var listInit = true;

		var sortedByCreated = _.sortBy(data, function (el) {
			return -Date.parse(el.created);
		});

		var latestTpl = _.template($('#components-small-template').html(), {
			title: 'Latest components',
			components: sortedByCreated.slice(0, 5)
		});

		var hotTpl = _.template($('#components-small-template').html(), {
			title: 'Hot components',
			components: _.sortBy(sortedByCreated.slice(0, 50), function (el) {
				return -el.stars;
			}).slice(0, 5)
		});

		var componentsTpl = _.template($('#components-template').html(), {
			components: _.sortBy(data, function (el) {
				return -el.stars;
			})
		});

		$('#loading').hide();
		$('#components')
			.append(latestTpl)
			.append(hotTpl)
			.append(componentsTpl)
			.find('.search').show();

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
				$(document).on('keyup', function (e) {
					var pageBtns = $('#components').find('.paging li');

					if (e.which === 37) {
						pageBtns.filter(':contains(«)').click();
					}

					if (e.which === 39) {
						pageBtns.filter(':contains(»)').click();
					}
				});
			}

			$('.table thead').toggle(list.matchingItems.length !== 0);
			$('#search-notfound').toggle(list.matchingItems.length === 0);
		});

		$('.credit img').on('mouseover mouseout', function (e) {
			$(this).toggleClass('animated tada', e.type === 'mouseover');
		});
	}

	$(function() {
		$.getJSON(API_URL).then(render).fail(function () {
			$('#loading p').text('Failed to load component list :(');
		});
	});
})(jQuery);

// pagination?
// create Listjs bootstrap pagination plugin
