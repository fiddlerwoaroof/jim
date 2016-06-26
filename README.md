# JIM: The Javascript Interface Manager

Simple implementation of commands and presentation types mimicing some of the
nice features of CLIM.

The idea is that you assign types to the various things displayed on the page
and then define commands that operate on those types.

When you execute a command, the page activates the types corresponding to the
various arguments of the command in order.

## API

To make a new presentation type, either call `PresentationType(name)` directly
or call it via `new`.  `name` specifies the new type's name, which is used to
determine whether something is of that type.  This is also used as a element
class name in order to determine which elements are of this type.

```
var myType = new PresentationType('mytype');
```

Next, the presentation type must be bound to the corresponding tags. This is
done using `bindTags()` which returns the presentation type to allow for
chaining. This function iterates through the elements having `this.name` as one
of their classes and then attaches a presentation type to them using `data-bind`
to determine which events to bind (defaults to 'click', if not specified) and
uses either the value of the `value` attribute or of the `data-value` attribute,
as the "value" of the new instance of the presentation stype, if either is
specified. Otherwise, it defaults to the textContent of the tag.

```
myType.bindTags(); // bind the corresponding tags, returns myType
```

makeTag has any of these signatures:

```
makeTag(value, tagName)
makeTag(value, tagName, content)
makeTag(value, tagName, bindTypes, content)
```

`value` refers to the value associated with the object.  `content` represents
the text displayed that represents this value, it defaults to value if `content`
is not specified.  `tagName` specifies the kind of tag to be created.
`bindTypes` is an Array of strings indicating which events the presentation type
should handle.   If this is specified, you should either add functions with the
corresponding name to the type or setup receivers that can handle the event
using `addReceiver(receiver)`.
