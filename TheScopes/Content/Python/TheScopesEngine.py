import math
import datetime

class TheScopesEngine:
    """The Scopes calculation engine - provides astrology, numerology, biorhythm, and moon phase calculations."""
    
    ZODIAC_SIGNS = [
        (1, 20, 2, 18, "Aquarius"),
        (2, 19, 3, 20, "Pisces"),
        (3, 21, 4, 19, "Aries"),
        (4, 20, 5, 20, "Taurus"),
        (5, 21, 6, 20, "Gemini"),
        (6, 21, 7, 22, "Cancer"),
        (7, 23, 8, 22, "Leo"),
        (8, 23, 9, 22, "Virgo"),
        (9, 23, 10, 22, "Libra"),
        (10, 23, 11, 21, "Scorpio"),
        (11, 22, 12, 21, "Sagittarius"),
        (12, 22, 1, 19, "Capricorn"),
    ]
    
    LIFE_PATH_INTERPRETATIONS = {
        1: "The Leader - Independent, ambitious, innovative",
        2: "The Peacemaker - Cooperative, diplomatic, sensitive",
        3: "The Communicator - Creative, expressive, optimistic",
        4: "The Builder - Practical, disciplined, hardworking",
        5: "The Adventurer - Freedom-loving, versatile, curious",
        6: "The Nurturer - Responsible, caring, harmonious",
        7: "The Seeker - Analytical, spiritual, introspective",
        8: "The Achiever - Ambitious, powerful, material-focused",
        9: "The Humanitarian - Compassionate, idealistic, generous",
        11: "The Master Intuitive - Spiritual insight, inspiration",
        22: "The Master Builder - Visionary, practical idealism",
        33: "The Master Teacher - Compassion, spiritual guidance",
    }
    
    EXPRESSION_INTERPRETATIONS = {
        1: "Natural leader, independent, creative vision",
        2: "Diplomatic, cooperative, harmony-seeking",
        3: "Creative expression, communication, joy",
        4: "Practical builder, organized, reliable",
        5: "Versatile, adventurous, freedom of expression",
        6: "Nurturing, responsible, beauty-loving",
        7: "Analytical, spiritual depth, introspective",
        8: "Ambitious, material success, authority",
        9: "Humanitarian, compassionate, global vision",
    }
    
    SOUL_URGE_INTERPRETATIONS = {
        1: "Desires independence and personal achievement",
        2: "Desires partnership and emotional harmony",
        3: "Desires creative expression and joy",
        4: "Desires stability, order, and security",
        5: "Desires freedom, adventure, and variety",
        6: "Desires love, family, and responsibility",
        7: "Desires spiritual understanding and solitude",
        8: "Desires material success and recognition",
        9: "Desires to serve humanity and make a difference",
    }
    
    @staticmethod
    def reduce_to_single_digit(number):
        """Reduce a number to single digit (keeping master numbers 11, 22, 33)."""
        while number > 9 and number not in (11, 22, 33):
            number = sum(int(d) for d in str(number))
        return number
    
    @staticmethod
    def get_letter_value(letter):
        """Get numerology value of a letter (A=1, B=2, ... I=9, J=1, etc.)."""
        letter = letter.upper()
        if not letter.isalpha():
            return 0
        return (ord(letter) - ord('A')) % 9 + 1
    
    @staticmethod
    def is_vowel(letter):
        """Check if a letter is a vowel."""
        return letter.upper() in 'AEIOU'
    
    @classmethod
    def calculate_sun_sign(cls, birth_month, birth_day):
        """Calculate zodiac sun sign from birth month and day."""
        for start_m, start_d, end_m, end_d, name in cls.ZODIAC_SIGNS:
            if start_m == end_m:
                if birth_month == start_m and start_d <= birth_day <= end_d:
                    return name
            else:
                if (birth_month == start_m and birth_day >= start_d) or \
                   (birth_month == end_m and birth_day <= end_d):
                    return name
        return "Unknown"
    
    @classmethod
    def calculate_moon_phase(cls, year, month, day):
        """Calculate current moon phase name and illumination percentage."""
        # Known new moon: January 6, 2000
        ref_date = datetime.date(2000, 1, 6)
        target_date = datetime.date(year, month, day)
        days_since_ref = (target_date - ref_date).days
        
        lunar_cycle = 29.53059
        cycle_position = days_since_ref % lunar_cycle
        if cycle_position < 0:
            cycle_position += lunar_cycle
        
        phase_percent = cycle_position / lunar_cycle
        phase = phase_percent * 8.0
        
        if phase < 0.5 or phase >= 7.5:
            phase_name = "New Moon"
        elif phase < 1.5:
            phase_name = "Waxing Crescent"
        elif phase < 2.5:
            phase_name = "First Quarter"
        elif phase < 3.5:
            phase_name = "Waxing Gibbous"
        elif phase < 4.5:
            phase_name = "Full Moon"
        elif phase < 5.5:
            phase_name = "Waning Gibbous"
        elif phase < 6.5:
            phase_name = "Last Quarter"
        else:
            phase_name = "Waning Crescent"
        
        return phase_name, phase_percent
    
    @classmethod
    def calculate_life_path(cls, birth_date_str):
        """Calculate life path number from birth date string (YYYY-MM-DD)."""
        parts = birth_date_str.split('-')
        if len(parts) != 3:
            return 0, "Invalid date format. Use YYYY-MM-DD."
        
        year = int(parts[0])
        month = int(parts[1])
        day = int(parts[2])
        
        year_sum = cls.reduce_to_single_digit(year)
        month_sum = cls.reduce_to_single_digit(month)
        day_sum = cls.reduce_to_single_digit(day)
        
        life_path = cls.reduce_to_single_digit(year_sum + month_sum + day_sum)
        interpretation = cls.LIFE_PATH_INTERPRETATIONS.get(life_path, "Unique path")
        
        return life_path, interpretation
    
    @classmethod
    def calculate_expression_number(cls, full_name):
        """Calculate expression number from full name."""
        total = sum(cls.get_letter_value(c) for c in full_name if c.isalpha())
        expression = cls.reduce_to_single_digit(total)
        interpretation = cls.EXPRESSION_INTERPRETATIONS.get(expression, "Unique expression")
        return expression, interpretation
    
    @classmethod
    def calculate_soul_urge(cls, full_name):
        """Calculate soul urge number from full name (vowels only)."""
        total = sum(cls.get_letter_value(c) for c in full_name if cls.is_vowel(c))
        soul_urge = cls.reduce_to_single_digit(total)
        interpretation = cls.SOUL_URGE_INTERPRETATIONS.get(soul_urge, "Unique soul desire")
        return soul_urge, interpretation
    
    @classmethod
    def calculate_biorhythm(cls, days_alive):
        """Calculate biorhythm percentages for physical, emotional, and intellectual cycles."""
        physical = math.sin(2 * math.pi * days_alive / 23) * 100
        emotional = math.sin(2 * math.pi * days_alive / 28) * 100
        intellectual = math.sin(2 * math.pi * days_alive / 33) * 100
        return physical, emotional, intellectual
    
    @classmethod
    def calculate_all(cls, full_name, birth_date_str):
        """Calculate all scope readings at once."""
        parts = birth_date_str.split('-')
        year, month, day = int(parts[0]), int(parts[1]), int(parts[2])
        
        birth_date = datetime.date(year, month, day)
        today = datetime.date.today()
        days_alive = (today - birth_date).days
        
        sun_sign = cls.calculate_sun_sign(month, day)
        moon_phase_name, moon_phase_percent = cls.calculate_moon_phase(today.year, today.month, today.day)
        life_path, life_path_interp = cls.calculate_life_path(birth_date_str)
        expression, expression_interp = cls.calculate_expression_number(full_name)
        soul_urge, soul_urge_interp = cls.calculate_soul_urge(full_name)
        physical, emotional, intellectual = cls.calculate_biorhythm(days_alive)
        
        return {
            "sun_sign": sun_sign,
            "moon_phase": moon_phase_name,
            "moon_phase_percent": moon_phase_percent,
            "life_path": life_path,
            "life_path_interpretation": life_path_interp,
            "expression": expression,
            "expression_interpretation": expression_interp,
            "soul_urge": soul_urge,
            "soul_urge_interpretation": soul_urge_interp,
            "physical": round(physical, 1),
            "emotional": round(emotional, 1),
            "intellectual": round(intellectual, 1),
            "days_alive": days_alive,
        }


# Register as a UE Python module
# Usage: from TheScopesEngine import TheScopesEngine
# result = TheScopesEngine.calculate_all("Patricia Susur", "1990-05-15")
