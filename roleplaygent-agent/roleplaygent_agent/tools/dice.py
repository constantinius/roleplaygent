from random import randint

from agents import function_tool

@function_tool
def roll_dice(num_dice: int, num_sides: int) -> int:
    """ Rolls the number of dice the specified number of times.
    """
    print(f"Rolling {num_dice}d{num_sides}")
    return sum(randint(1, num_sides) for _ in range(num_dice))