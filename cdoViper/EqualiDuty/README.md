# EqualiDuty

**Reason:**
1. We are too lazy to sit down and plan duty every week

2. At the start of every month, we have to come up with a duty roster system.

3. However, we lack the insight to consider personal schedules for the **whole month**, while maintaining fairness between the **number** of duties done, and the **type** of duty done (one is slacker than the other).


**Features:**
1. Uses a random algorithm to distribute duties to each person equally. Ensure that no two people have > 1 duty allocation difference (e.g. 4 duties allocated vs 6 duties allocated).

2. Uses a deconflict algorithm to cycle through days and swap based on availability. E.g. B is not free on 4th. A is taking duty on 1st. B checks if A is free on 4th, and if B is free on 1st before swapping internally.

3. Easily configure number of people, timeframe, personal schedules with a config.json file. Script takes care of the rest with D-R-Y fundementals.

4. Exports data into output.json file, which can be used to load into excel etc.

**Future upgrades:**
1. On-the-fly schedule changes. Constructs model of current schedule from input.json file, and automatically deconflict clashes from a certain time onwards. This upgrade can be done easily due to the modular nature of the deconflict function.

2. An adaptor to load output.json file to excel sheet seamlessly. After upgrade 1, a similar adaptor can be created to construct model directly from current schedule in excel sheet.

3. Weighted duty distributions to allow for some people to take a percentage of more duties compared to others.


## How to use
1. Copy paste or git clone current folder into local workspace
2. Configure config.json based on organisational requirements
3. Run main.py script to get output.json
```
python3 main.py
```