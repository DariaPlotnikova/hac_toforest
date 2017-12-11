## Инструкция по установке

* Установите virtualenv
* Выполните ``virtualenv venv`` или на винде - ``workon venv``
* Активируйте виртуал окружение
```
source venv/bin/activate

# windows
cd venv/Scripts
activate.bat
```

* Установи зависимости
```
pip install -r requirements.txt
```

## Выйти из venv
```
deactivate
```

## Запуск локальной Google SQL Proxy
```
./cloud_sql_proxy -instances=gpsorient:asia-east1:gpsorient-db=tcp:3306
```

## Подключиться локально к серверу БД
```
psql 'host=127.0.0.1 port=3306 sslmode=disable dbname=postgres user=postgres'
```