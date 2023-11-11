import json
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

rules_list = None
max_val = None


def automaton(request):
    template = loader.get_template('automaton.html')
    context = {
        'rulesList': rules_list,
        'maxVal': max_val
    }
    return HttpResponse(template.render(context, request))


@csrf_exempt
def main(request):
    global rules_list, max_val
    template = loader.get_template('main.html')
    if request.method == "POST":
        print(request.body)
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        rules_list = body['rulesList']
        max_val = body['maxVal']
        return HttpResponse(template.render(dict(), request))
    else:
        cross_product_dict = lambda X, Y: {x: {y: x + y for y in Y} for x in X}
        rows = [str(i) for i in range(8)]
        cols = [str(i) for i in range(3)]
        context = {
            'cols': cols,
            'rows': rows,
            'cross_prod': cross_product_dict(rows, cols)
        }
        return HttpResponse(template.render(context, request))
