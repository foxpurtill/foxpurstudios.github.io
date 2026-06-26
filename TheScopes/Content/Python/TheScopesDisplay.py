"""
The Scopes - Screen Display HUD
Draws the scopes reading directly to the screen using Canvas.
Attach this to a PlayerController or use as a standalone HUD.
"""
import unreal
import json
import os

class TheScopesScreenDisplay:
    """Draws scopes results to screen using Canvas."""
    
    @staticmethod
    def draw_scopes(canvas, data, screen_width, screen_height):
        """Draw the scopes reading to canvas."""
        # Title
        canvas.set_text_color(unreal.LinearColor(0.8, 0.7, 1.0, 1.0))
        canvas.set_text_size(32.0)
        canvas.draw_text("THE SCOPES", screen_width * 0.5, 40.0, 0.5)
        
        # Divider
        canvas.set_text_size(16.0)
        canvas.draw_text("=" * 50, screen_width * 0.5, 80.0, 0.5)
        
        y = 120.0
        line_height = 28.0
        
        # Astrology section
        canvas.set_text_color(unreal.LinearColor(0.6, 0.8, 1.0, 1.0))
        canvas.set_text_size(22.0)
        canvas.draw_text("ASTROLOGY", screen_width * 0.5, y, 0.5)
        y += line_height + 10
        
        canvas.set_text_color(unreal.LinearColor(1.0, 1.0, 1.0, 1.0))
        canvas.set_text_size(18.0)
        canvas.draw_text(f"Sun Sign: {data['sun_sign']}", screen_width * 0.5, y, 0.5)
        y += line_height
        canvas.draw_text(f"Moon Phase: {data['moon_phase']}", screen_width * 0.5, y, 0.5)
        y += line_height + 20
        
        # Numerology section
        canvas.set_text_color(unreal.LinearColor(0.8, 0.6, 1.0, 1.0))
        canvas.set_text_size(22.0)
        canvas.draw_text("NUMEROLOGY", screen_width * 0.5, y, 0.5)
        y += line_height + 10
        
        canvas.set_text_color(unreal.LinearColor(1.0, 1.0, 1.0, 1.0))
        canvas.set_text_size(18.0)
        canvas.draw_text(f"Life Path: {data['life_path']} - {data['life_path_interpretation']}", screen_width * 0.5, y, 0.5)
        y += line_height
        canvas.draw_text(f"Expression: {data['expression']} - {data['expression_interpretation']}", screen_width * 0.5, y, 0.5)
        y += line_height
        canvas.draw_text(f"Soul Urge: {data['soul_urge']} - {data['soul_urge_interpretation']}", screen_width * 0.5, y, 0.5)
        y += line_height + 20
        
        # Biorhythm section
        canvas.set_text_color(unreal.LinearColor(0.6, 1.0, 0.8, 1.0))
        canvas.set_text_size(22.0)
        canvas.draw_text(f"BIORHYTHM (Day {data['days_alive']})", screen_width * 0.5, y, 0.5)
        y += line_height + 10
        
        canvas.set_text_color(unreal.LinearColor(1.0, 1.0, 1.0, 1.0))
        canvas.set_text_size(18.0)
        canvas.draw_text(f"Physical: {data['physical']}%", screen_width * 0.5, y, 0.5)
        y += line_height
        canvas.draw_text(f"Emotional: {data['emotional']}%", screen_width * 0.5, y, 0.5)
        y += line_height
        canvas.draw_text(f"Intellectual: {data['intellectual']}%", screen_width * 0.5, y, 0.5)
        
        return y + line_height + 40
    
    @staticmethod
    def draw_biorhythm_bars(canvas, data, screen_width, y_start):
        """Draw biorhythm cycle bars."""
        bar_width = 300
        bar_height = 20
        center_x = screen_width * 0.5
        
        cycles = [
            ("Physical", data['physical'], unreal.LinearColor(1.0, 0.3, 0.3, 1.0)),
            ("Emotional", data['emotional'], unreal.LinearColor(0.3, 1.0, 0.3, 1.0)),
            ("Intellectual", data['intellectual'], unreal.LinearColor(0.3, 0.3, 1.0, 1.0)),
        ]
        
        y = y_start
        for name, value, color in cycles:
            canvas.set_text_color(unreal.LinearColor(0.8, 0.8, 0.8, 1.0))
            canvas.set_text_size(14.0)
            canvas.draw_text(f"{name}: {value}%", center_x - bar_width/2 - 80, y, 0.0)
            
            # Draw bar background
            canvas.set_draw_color(unreal.LinearColor(0.2, 0.2, 0.2, 1.0))
            canvas.draw_rect(unreal.LinearColor(0.2, 0.2, 0.2, 1.0), 
                           center_x - bar_width/2, y, bar_width, bar_height)
            
            # Draw bar fill (normalized to 0-100%)
            fill_width = abs(value) / 100.0 * bar_width
            if value >= 0:
                canvas.draw_rect(color, center_x, y, fill_width, bar_height)
            else:
                canvas.draw_rect(color, center_x - fill_width, y, fill_width, bar_height)
            
            y += bar_height + 15
        
        return y
