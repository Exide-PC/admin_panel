import re
import subprocess

class NzxtStatus:
    def __init__(self, cpu_temperature: int) -> None:
        self.cpu_temperature = cpu_temperature

# https://phoenixnap.com/kb/linux-cpu-temp

class NzxtStatusService:
    def __init__(self) -> None:
        pass

    def get_status(self):
        result = subprocess.run(['sensors'], stdout=subprocess.PIPE)
        lines = result.stdout.decode('utf-8').split('\n')

        cpu_line = next(l for l in lines if l.startswith('Package id 0'))
        matches = re.findall(r'(\d+\.\d+)°C', cpu_line)
        numbers = list(map(lambda m: int(m), matches))

        return NzxtStatus(numbers[0])