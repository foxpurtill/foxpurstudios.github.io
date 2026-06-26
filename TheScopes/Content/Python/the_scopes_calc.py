"""
The Scopes - Standalone Calculator
Run this to calculate your scopes and output a JSON file that UE can read.
Usage: python the_scopes_calc.py "Full Name" "YYYY-MM-DD"
"""
import sys
import json
import math
import datetime
from TheScopesEngine import TheScopesEngine

def main():
    if len(sys.argv) < 3:
        print("Usage: python the_scopes_calc.py \"Full Name\" \"YYYY-MM-DD\"")
        print("Example: python the_scopes_calc.py \"Patricia Susur\" \"1990-05-15\"")
        sys.exit(1)
    
    full_name = sys.argv[1]
    birth_date = sys.argv[2]
    
    result = TheScopesEngine.calculate_all(full_name, birth_date)
    
    # Save to JSON for UE to read
    output_path = r"E:\UE_Projects\AICopilot\ProjectOne\Content\TheScopes\latest_reading.json"
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"\n{'='*50}")
    print(f"  THE SCOPES - {full_name}")
    print(f"  Born: {birth_date}")
    print(f"{'='*50}")
    print(f"\n  ASTROLOGY")
    print(f"  Sun Sign:      {result['sun_sign']}")
    print(f"  Moon Phase:    {result['moon_phase']} ({result['moon_phase_percent']:.0%})")
    print(f"\n  NUMEROLOGY")
    print(f"  Life Path:     {result['life_path']} - {result['life_path_interpretation']}")
    print(f"  Expression:    {result['expression']} - {result['expression_interpretation']}")
    print(f"  Soul Urge:     {result['soul_urge']} - {result['soul_urge_interpretation']}")
    print(f"\n  BIORHYTHM (Day {result['days_alive']} since birth)")
    print(f"  Physical:      {result['physical']}%")
    print(f"  Emotional:     {result['emotional']}%")
    print(f"  Intellectual:  {result['intellectual']}%")
    print(f"\n{'='*50}")
    print(f"\n  Saved to: {output_path}")

if __name__ == "__main__":
    main()
