
// Toggle "active" or "selected" classname on any elements decorated with data-toggle-class-active or data-toggle-class-selected etc.
// Elements must be siblings OR the parent elements, optionally identified by specifiying a css selector, must be siblings.

;(function (factory) {

  // Register as an anonymous AMD module if relevant, otherwise assume oldskool browser globals:
  if (typeof window.define === "function" && define.amd)
    define(["jquery"], factory);
  else
    factory(jQuery);

})(function( $, undefined ) {

  /* jshint laxcomma:true, asi:true, debug:true, curly:false, camelcase:true, browser:true */
  /* global define, h3g, console */
  "use strict"

  // Optional extra attributes:
  //   data-toggle-self     To force toggle on self whenever it is clicked (instead of always adding the class, as we would for tabs)
  //   data-toggle-siblings To force toggle on siblings to be the opposite of self (instead of always removing the class from them, as we would for tabs)
  // Optional extra attribute values:
  //   Specify a value for data-toggle-self     to test for if-condition on closest matching parent, eg data-toggle-self="DIV.is-invoiced"
  //   Specify a value for data-toggle-siblings to test for if-condition on closest matching parent, eg data-toggle-siblings="HTML.is-tablet"


  // These are the class names you can toggle:
  var classnames = 'active selected hide in'

  // This helper works like jQuery .closest(selector) if it matches an element, otherwise return .closest() that has(selector) 
  var closestOrHas = function(selector){
    var closest = this.closest( selector || '*' )
    return closest.length ? closest : this.closest(':has(' + selector + ')').find(selector)
  }


  $.each( classnames.split(' '), function(i,classname){

    var attr                   = 'toggle-' + classname + '-class-for'
      , dataAttr               = '[data-' + attr + ']'
      , notClassname           = 'not-' + classname // An inverse class to apply when classname not set.
      , toggleSelfAttr         = 'toggle-self'
      , toggleSelfDataAttr     = '[data-' + toggleSelfAttr + ']'
      , toggleSiblingsAttr     = 'toggle-siblings'
      , toggleSiblingsDataAttr = '[data-' + toggleSiblingsAttr + ']'
      , toggleEvent            = 'toggle:class'

      // Extra data attribute added while toggling siblings, to avoid recursion:
      , isToggling             = 'isToggling'
      , isRecursiveToggle      = function(){ return $(this).data(isToggling) }


    $(document)


    .on( 'click', dataAttr, function(e){

      // Trigger toggle event: (and prevent <a> links from actioning)
      $(this).trigger(toggleEvent).is('A') && e.preventDefault()

    })


    .on( toggleEvent, dataAttr, function( e, isRecursive ){

      window.console && console.log('on' + e.type + ( isRecursive ? ' (Sibling)' : '' ), arguments)

      var self     = $(this) //.data(isToggling,true)
        , selector = self.data(attr) || ( this.nodeName + dataAttr ) // If no selector specified, create one to find others of same type & data-attr.
        , target   = closestOrHas.call(self,selector)                // Target is self or closest parent that matches selector.
        , siblings = target.siblings(selector)                       // Find siblings that match selector (if any).
        , ifSelector
        , toggleSelf
        , toggleSiblings
        , doToggleSelf
        , doToggleSiblings

      // Allow for optional data-toggle-siblings attribute:
      // Toggle class on siblings if explicitly specified, otherwise assume we need to remove the class from them:
      ifSelector       = self.is(toggleSiblingsDataAttr) && ( self.data(toggleSiblingsAttr) || true )
      doToggleSiblings = ifSelector && ( ifSelector === true || self.closest(ifSelector).length )

      if( !isRecursive && doToggleSiblings && siblings.length && target.hasClass(classname) ){

        siblings.find('*').filter(function(){
          var self          = $(this)
            , hasToggleAttr = self.is(dataAttr)
            , selector      = hasToggleAttr && self.data(attr)
          return hasToggleAttr && ( !selector || self.closest(selector)[0] )
        })

        .trigger('toggle', [true] )

        // Special behaviour for sibling toggler elements that are <label for="another form element">
        .filter('[for]').each(function(){
          var forID = $(this).attr('for')
          if(forID) $( '#' + forID ).trigger('change')
        })

      }else{

        // Allow for optional data-toggle-self attribute:
        // Toggle class on self if explicitly specified or decide for ourselves based on presence of siblings:
        ifSelector   = self.is( toggleSelfDataAttr ) && ( self.data(toggleSelfAttr) || true )
        doToggleSelf = ifSelector && ( ifSelector === true || self.closest(ifSelector).length )
        toggleSelf   = ( doToggleSelf || !siblings.length ) ? undefined : true

        // Do the toggling on the main target:
        target.toggleClass( classname, toggleSelf )
              .toggleClass( notClassname, !target.hasClass(classname) )

        siblings.addClass(notClassname)
                .removeClass(classname)

      }

      // Housekeeping: Switch off our custom recursion-tracking flag:
      // self.removeData(isToggling)

    })

  })

});