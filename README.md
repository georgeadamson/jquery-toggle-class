jquery-toggle-class
===================

Any element decorated with a **data-toggle-active-class-for** attribute will now toggle a class on a related element.

No further coding needed.

For example, when you click on this element...

<pre>
  &lt;a data-toggle-active-class-for=".another-element"&gt;
</pre>

  ...it will toggle the "active" class on
  
<pre>
  &lt;div class="another-element"&gt;
</pre>

Other classes can be toggled too:
* data-toggle-active-class-for
* data-toggle-selected-class-for
* data-toggle-hide-class-for
* data-toggle-in-class-for (Eg: The "in" class is used by Bootstrap)
