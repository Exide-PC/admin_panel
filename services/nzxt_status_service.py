import subprocess

class NzxtStatus:
    def __init__(self, cpu_temperature: int) -> None:
        self.cpu_temperature = cpu_temperature

class NzxtStatusService:
    def __init__(self) -> None:
        pass

    def get_status(self):
        result = subprocess.run(['cat', '/sys/class/thermal/thermal_zone1/temp'], stdout=subprocess.PIPE)
        cpu_temperature = int(result.stdout.decode('utf-8')) / 1000
        return NzxtStatus(cpu_temperature)