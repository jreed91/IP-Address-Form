(function($) {
    $.widget('ui.ipComplete', {
        options: {
           delimiter: '.',
           octetLimit          : 7,   // Max number of tags allowed (null for unlimited).
            beforeOctetAdded      : null,
            afterOctetAdded       : null,

            beforeOctetRemoved    : null,
            afterOctetRemoved     : null,

            onOctetClicked        : null,
            onOctetLimitExceeded  : null,
            allowIPv6             : false
        },

        _create: function() {
            var that = this;

            if (this.element.is('input')) {
                this.ipList = $('<ul></ul>').insertAfter(this.element);
                this.element.addClass('ip-hidden-field');
            } else {
                this.ipList = this.element.find('ul, ol').andSelf().last();
            }

            this.ipInput = $('<input type="number" />').addClass('ui-widget-content')

            this.ipList
                .addClass('ip')
                .addClass('ui-widget ui-widget-content ui-corner-all')

                .append($('<li class="ip-new"></li>').append(this.ipInput))
                .click(function(e) {
                    var target = $(e.target);
                    if (target.hasClass('ip-octet')) {
                        var octet = target.closest('.ip-choice');
                        if(!octet.hasClass('remove')) {
                            that._trigger('onOctetClicked', e, {octet: octet, octetLabel: that.octetLabel(octet)});
                        } else {
                            that.ipInput.focus();
                        }
                    }
                });
            this.ipInput
                .bind("paste", function(event) {
                    var pastedData = event.originalEvent.clipboardData.getData('text');
                    that.createOctetPasted(pastedData);
                })
                .keydown(function(event) {
                    if (event.which == $.ui.keyCode.BACKSPACE && that.ipInput.val() === '') {
                        var octet = that._lastOctet();
                        // When backspace is pressed, the last octet is deleted.
                        that.removeOctet(octet);
                    }
                    switch( event.keyCode ) {
                        case $.ui.keyCode.PERIOD:
                          that.createOctet(that._cleanedInput());
                          break;
                        case 110:
                          that.createOctet(that._cleanedInput());
                          break;
                      }
                    });
        },

       

        destroy: function() {
            $.Widget.prototype.destroy.call(this);

            this.element.unbind('.ip');
            this.ipList.unbind('.ip');

            this.ipList.removeClass([
                'ip',
                'ui-widget',
                'ui-widget-content',
                'ui-corner-all',
                'ip-hidden-field'
                ].join(' '));

            if (this.element.is('input')) {
                this.element.removeClass('ip-hidden-field');
                this.ipList.remove();
            } else {
                this.element.children('li').each(function() {
                    if ($(this).hasClass('ip-new')) {
                        $(this).remove();
                    } else {
                        $(this).removeClass([
                            'ip-choice',
                            'ui-widget-content',
                            'ui-state-default',
                            'ui-state-highlight',
                            'ui-corner-all',
                            'remove'
                        ].join(' '));
                    }
                });

                if (this.singleFieldNode) {
                    this.singleFieldNode.remove();
                }
            }

            return this;
        },

         _cleanedInput: function() {
            // Returns the contents of the tag input, cleaned and ready to be passed to createTag
            return $.trim(this.ipInput.val().replace(/^"(.*)"$/, '$1'));
        },

         _octets: function() {
            return this.ipList.find('.ip-choice:not(.removed)');
        },

        _lastOctet: function() {
            return this.ipList.find('.ip-choice:last:not(.removed)');
        },

        createOctetPasted: function(value, additionalClass, duringInitialization) {
            var that = this;

            if (value === '') {
                return false;
            }
            
            var ip = value.match(/^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/);
            
            for (var i = 0; i < ip.length; i++) {
                if (i == 0) {
                    continue;
                }
                var label = $(this.options.onOctetClicked ? '<a class="ip-label"</a>' : '<span class="ip-label"></span>').text(ip[i]);


                var octet = $('<li></li>')
                    .addClass('ip-choice ui-widget-content ui-state-default ui-corner-all')
                    .append(label);
                var decimal = $('<li></li>')
                    .addClass('ip-choice ui-widget-content ui-state-default ui-corner-all')
                    .append('<span class="ip-label">.</span>');


                octet.addClass('ip-choice-editable');
                decimal.addClass('ip-choice-editable');

                if (this._trigger('beforeOctetAdded', null, {
                    octet: octet,
                    octetLabel: this.octetLabel(octet),
                    duringInitialization: duringInitialization
                }) === false) {
                    return;
                }

                this.ipInput.val('');
                this.ipInput.parent().before(octet);

                 if (this.options.octetLimit && this._octets().length < this.options.octetLimit - 1) {
                    decimal.insertAfter(octet);
                }

                

                this._trigger('afterOctetAdded', null, {
                    octet: octet,
                    octetLabel: this.octetLabel(octet),
                    duringInitialization: duringInitialization
                });

            };

           
        },

        createOctet: function(value, additionalClass, duringInitialization) {
            var that = this;

            value = $.trim(value);

            if (value === '') {
                return false;
            }

            if (this.options.octetLimit && this._octets().length >= this.options.octetLimit) {
                this._trigger('onOctetLimitExceeded', null, {duringInitialization: duringInitialization});
                return false;
            }

            var label = $(this.options.onOctetClicked ? '<a class="ip-label"</a>' : '<span class="ip-label"></span>').text(value);


            var octet = $('<li></li>')
                .addClass('ip-choice ui-widget-content ui-state-default ui-corner-all')
                .append(label);
            var decimal = $('<li></li>')
                .addClass('ip-choice ui-widget-content ui-state-default ui-corner-all')
                .append('<span class="ip-label">.</span>');


            octet.addClass('ip-choice-editable');
            decimal.addClass('ip-choice-editable');

            

            if (this._trigger('beforeOctetAdded', null, {
                octet: octet,
                octetLabel: this.octetLabel(octet),
                duringInitialization: duringInitialization
            }) === false) {
                return;
            }

            this.ipInput.val('');
            this.ipInput.parent().before(octet);

             if (this.options.octetLimit && this._octets().length < this.options.octetLimit - 1) {
                decimal.insertAfter(octet);
            }

            

            this._trigger('afterOctetAdded', null, {
                octet: octet,
                octetLabel: this.octetLabel(octet),
                duringInitialization: duringInitialization
            });

        },

        removeOctet: function(octet) {
            octet = $(octet);
             this._trigger('onOctetRemoved', null, octet);

            if (this._trigger('beforeOctetRemoved', null, {octet: octet, octetLabel: this.octetLabel(octet)}) === false) {
                return;
            }

            octet.remove();
            this._trigger('afterOctetRemoved', null, {octet: octet, octetLabel: this.octetLabel(octet)});
        },

        octetLabel: function(octet) {
            // Returns the tag's string label.
            return $(octet).find('input:first').val();
        },

    })
}(jQuery));

