/**
 * Project: Bootstrap Collapse Clickchange
 * Author: Ben Freke
 *
 * Dependencies: Bootstrap's Collapse plugin, jQuery
 *
 * A simple plugin to enable Bootstrap collapses to provide additional UX cues.
 *
 * License: GPL v2
 *
 * Version: 1.0.2
 */
(function ($) {

    "use strict";

    var ClickChange;
    ClickChange = function () {
    };

    ClickChange.defaults = {
        'when': 'before',
        'targetclass': '',
        'parentclass': '',
        'iconchange': false,
        'iconprefix': 'glyphicon',
        'iconprefixadd': true,
        'iconclass': ''
    };

    /**
     * Set up the functions to fire on the bootstrap events
     * @param options The options passed in
     * @param controller Optional parent which controls a groups options
     * @returns object For chaining
     */
    $.fn.clickChange = function (options, controller) {
        var defaultSettings, theParent, i, initSettings, setIconClass;

        /**
         * Updates settings so I can override on the children
         * @param oldData
         * @param newData
         * @returns {void|*}
         */
        initSettings = function(oldData, newData) {
            var customSettings;
            customSettings = $.extend(
                {},
                oldData,
                newData
            );
            return customSettings;
        };

        /**
         * Set's the icon class just before we need to know if we should use it
         * @param settings
         */
        setIconClass = function(settings) {
            var tmpArr;
            if (settings.iconclass.length && settings.iconprefixadd) {
                tmpArr = settings.iconclass.split(' ');
                settings.iconclass = '';
                for (i = 0; i < tmpArr.length; i++) {
                    if (settings.iconclass.length) {
                        settings.iconclass += ' ';
                    }
                    settings.iconclass += settings.iconprefix + '-' + tmpArr[i];
                }
            }
        };

        // It's a grouping, as the data is on the parent element. Initialise on the children only
        if ($(this).data('toggle') !== 'collapse') {
            theParent = $(this);
            // Find only the elements that are part of this grouping
            theParent
                .find('[data-parent="#' + theParent.attr('id') + '"]')
                .clickChange(null, theParent);
            // return false so nothing happens
            return false;
        }

        // In a grouping, I've passed in the controller to get data from. But still over-ride if required
        defaultSettings = $.extend(
            {},
            ClickChange.defaults,
            $(this).data(),
            (typeof controller === 'object' && controller) ? controller.data() : {},
            typeof options === 'object' && options
        );

        // Because it could be a group of children, we use each to iterate over the jQuery object
        $(this).each(function (index, element) {
            var clickElement, clickTarget, elementSettings, eventStart, eventEnd;
            clickElement = $(element);

            // Use settings specific to this element
            elementSettings = initSettings(defaultSettings, clickElement.data());
            setIconClass(elementSettings);

            // Get my target. This handles buttons and a tags
            clickTarget = clickElement.attr('href') || clickElement.attr('data-target');

            // turn off previous events if we're re-initialising.
            if (clickElement.data('clickchange')) {
                $(document).off('show.bs.collapse hide.bs.collapse', clickTarget);
                $(document).off('shown.bs.collapse hidden.bs.collapse', clickTarget);
            }
            clickElement.data('clickchange', 'yes');

            // As we're toggling, the same changes happen for both events
            eventStart = (elementSettings.when === 'after') ? 'shown' : 'show';
            eventEnd = (elementSettings.when === 'after') ? 'hidden' : 'hide';
            $(document).on(eventStart + '.bs.collapse ' + eventEnd + '.bs.collapse', clickTarget, function (event) {

                // Stop the event bubbling up the chain to the parent collapse
                event.stopPropagation();

                // Toggle clickable element class?
                if (elementSettings.parentclass) {
                    clickElement.toggleClass(elementSettings.parentclass);
                }

                // Toggle the target class?
                if (elementSettings.targetclass) {
                    $(event.target).toggleClass(elementSettings.targetclass);
                }

                // Do I have icons to change?
                if (elementSettings.iconchange && elementSettings.iconclass.length) {
                    clickElement.find('.' + elementSettings.iconprefix).toggleClass(elementSettings.iconclass);
                }
            });

        });
        return this;
    };

    $(document).ready(function () {
        // Clickchange to all toggleable elements
        $('[data-click="clickchange"]').each(function () {
            $(this).clickChange(null, null);
        });
    });
}(jQuery));