from django.urls import path
from . import views

urlpatterns = [
    path('automaton/', views.automaton, name='automaton'),
    path('', views.main, name='main'),
]