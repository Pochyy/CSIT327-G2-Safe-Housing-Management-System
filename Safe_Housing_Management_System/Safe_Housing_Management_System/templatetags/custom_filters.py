from django import template

register = template.Library()

@register.filter
def split(value, arg):
    return value.split(arg)

@register.filter
def intcomma(value):
    try:
        value = int(float(value))
        return "{:,}".format(value)
    except (ValueError, TypeError):
        return value
