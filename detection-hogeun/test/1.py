admins = ['admin', 'root', 'service', 'Admin', 'administrator', 'Camera', 'Recorder', 'admin1', 'supervisor']
pws = ['admin', '', 'service', 'root', '1234', ' 12345', 'Admin', 'system', 'supervisor', 'admin pass', '1111', '4321', '11111111', '1111111', '123']

for ad in admins:
    for pw in pws:
        print(f'{ad}:{pw}')