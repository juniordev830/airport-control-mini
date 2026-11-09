import unittest
from runway import Operation, Runway

class RunwayTests(unittest.TestCase):
    def test_schedule(self):
        runway = Runway("01")
        runway.schedule(Operation("GX101", "landing", 10, 3))
        self.assertEqual(runway.next_available(10, 3), 15)

    def test_conflict(self):
        runway = Runway("01")
        runway.schedule(Operation("GX101", "landing", 10, 3))
        with self.assertRaises(ValueError):
            runway.schedule(Operation("GX102", "takeoff", 14, 2))

    def test_separated_flights(self):
        runway = Runway("01")
        runway.schedule(Operation("GX101", "landing", 10, 3))
        runway.schedule(Operation("GX102", "takeoff", 15, 2))
        self.assertEqual(len(runway.operations), 2)

    def test_invalid_operation(self):
        with self.assertRaises(ValueError):
            Operation("GX101", "landing", -1, 3)

if __name__ == "__main__":
    unittest.main()
