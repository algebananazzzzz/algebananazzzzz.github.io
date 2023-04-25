import json
import math
import random
import multiprocessing

with open('config.json', 'r') as file:
    config = json.load(file)

people_list = config["people"]

# Specification of timeframe based on week
timeframe = config["timeframe"]
restrictions = config["restrictions"]

# Total number of days
number_of_days = sum([y-x for x, y in timeframe.values()])
# Calc number of P1 / P2 duties for equal distribution
equal_dist = math.ceil(number_of_days / len(people_list))
total_equal_dist = number_of_days * 2 / len(people_list)
types_of_duty = ["P1", "P2"]
duty_dist = {0: people_list}


def replace_in_list(l, x, y):
    l[l.index(x)] = y
    return


class People:
    objects = list()

    def __init__(self, name, commitments) -> None:
        self.name = name
        self.duties = {k: list() for k in types_of_duty}
        self.duties['total'] = 0
        commit = dict()
        for key, item in commitments.items():
            for i in key.split(','):
                commit[int(i)] = item
        self.commitments = commit
        People.objects.append(self)

    def get(name):
        for i in People.objects:
            if i.name == name:
                return i

    def is_conflicted(self, day):
        commitments = self.commitments
        try:
            reason = commitments[day]
            print("Conflict detected: ", reason)
            return True
        except KeyError:
            return False

    # Larger = doing less
    # def minor_inequality(self):
    #     return equal_dist

    def not_equal(self, duty_type):
        if len(self.duties[duty_type]) + 1 > equal_dist:
            return True
        return False


class Dutyday:
    objects = list()

    def __init__(self, day) -> None:
        self.day = day
        self.duties = {k: str() for k in types_of_duty}
        Dutyday.objects.append(self)

    def assign_duties(self):
        for duty_type in types_of_duty:
            not_equal = True
            while not_equal:
                person = random.choice(People.objects)
                if person.not_equal(duty_type):
                    pass
                else:
                    person_taken_duties = person.duties['total']
                    inequal_dist = False
                    if len(duty_dist) >= 3:
                        try:
                            if person.name in duty_dist[math.floor(total_equal_dist)]:
                                inequal_dist = True
                        except KeyError:
                            pass
                    if not inequal_dist:
                        duty_dist[person_taken_duties].remove(person.name)
                        if duty_dist[person_taken_duties] == list():
                            duty_dist.pop(person_taken_duties)
                        person_taken_duties += 1

                        try:
                            duty_dist[person_taken_duties].append(person.name)
                        except KeyError:
                            duty_dist[person_taken_duties] = [person.name]

                        self.duties[duty_type] = person.name
                        person.duties[duty_type].append(self.day)
                        person.duties['total'] = person_taken_duties
                        not_equal = False

        return self.duties

    def deconflict_duties(self):
        duties = self.duties

        for duty_type, duty_name in duties.items():
            person = People.get(duty_name)
            if person.is_conflicted(self.day):
                conflicted = True
                deconf_index = 0
                while conflicted:
                    deconf = Dutyday.objects[deconf_index]
                    if person.is_conflicted(deconf.day):
                        deconf_index += 1
                        print('Person cannot assume this day')

                    else:
                        deconf_person = People.get(deconf.duties[duty_type])
                        if deconf_person.is_conflicted(self.day):
                            deconf_index += 1
                            print('Swapped person conflict')
                        else:
                            print(deconf_person.name)
                            self.duties[duty_type] = deconf_person.name
                            deconf.duties[duty_type] = person.name

                            replace_in_list(
                                person.duties[duty_type], self.day, deconf.day)
                            replace_in_list(
                                deconf_person.duties[duty_type], deconf.day, self.day)
                            conflicted = False
                            print('Successfully resolved conflict')
        return


def main():
    for name in people_list:
        commitments = restrictions[name]
        People(name, commitments)

    for desc, dayrange in timeframe.items():
        for day in range(dayrange[0], dayrange[1]):
            Dutyday(day)

    for day in Dutyday.objects:
        day.assign_duties()

    for day in Dutyday.objects:
        day.deconflict_duties()

    with open('output.json', 'w') as file:
        data = dict()
        data["by_person"] = {
            people.name: people.duties for people in People.objects}
        data["by_day"] = {day.day: day.duties for day in Dutyday.objects}
        print(data)
        json.dump(data, file)
    return


if __name__ == "__main__":
    suceeded = False
    while not suceeded:
        process = multiprocessing.Process(target=main)
        process.start()

        # Wait for 5 seconds or until process finishes
        process.join(3)

        # If thread is still active
        if process.is_alive():
            print("timeout exceeded")
            process.terminate()
            process.join()
        else:
            suceeded = True
