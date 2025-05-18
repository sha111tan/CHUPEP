import secrets

# Генерируем случайную строку из 32 символов
device_key = secrets.token_urlsafe(32)
print("Ваш DEVICE_KEY:", device_key)