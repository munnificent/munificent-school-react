#!/bin/bash
fuser -k 8000/tcp 2>/dev/null
python manage.py runserver
