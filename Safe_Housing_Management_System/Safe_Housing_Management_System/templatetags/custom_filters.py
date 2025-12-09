from django import template
import math


register = template.Library()

@register.filter
def floor_rating(value):
    try:
        return int(math.floor(float(value)))
    except (ValueError, TypeError):
        return 0
    
    
@register.filter
def intcomma(value):
    try:
        value = int(float(value))
        return "{:,}".format(value)
    except (ValueError, TypeError):
        return value
