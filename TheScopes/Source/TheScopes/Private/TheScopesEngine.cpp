#include "TheScopesEngine.h"
#include "Internationalization/Regex.h"

FString UTheScopesEngine::CalculateSunSign(int32 BirthMonth, int32 BirthDay)
{
    // Zodiac sign date ranges (month, start_day, end_day, sign_name)
    struct FZodiacSign
    {
        int32 StartMonth;
        int32 StartDay;
        int32 EndMonth;
        int32 EndDay;
        FString Name;
    };

    const FZodiacSign Signs[] = {
        {1, 20, 2, 18, TEXT("Aquarius")},
        {2, 19, 3, 20, TEXT("Pisces")},
        {3, 21, 4, 19, TEXT("Aries")},
        {4, 20, 5, 20, TEXT("Taurus")},
        {5, 21, 6, 20, TEXT("Gemini")},
        {6, 21, 7, 22, TEXT("Cancer")},
        {7, 23, 8, 22, TEXT("Leo")},
        {8, 23, 9, 22, TEXT("Virgo")},
        {9, 23, 10, 22, TEXT("Libra")},
        {10, 23, 11, 21, TEXT("Scorpio")},
        {11, 22, 12, 21, TEXT("Sagittarius")},
        {12, 22, 1, 19, TEXT("Capricorn")}
    };

    for (const FZodiacSign& Sign : Signs)
    {
        if (Sign.StartMonth == Sign.EndMonth)
        {
            // Same month range (e.g., Aquarius: Jan 20 - Feb 18)
            if (BirthMonth == Sign.StartMonth && BirthDay >= Sign.StartDay && BirthDay <= Sign.EndDay)
            {
                return Sign.Name;
            }
        }
        else
        {
            // Cross-month range
            if ((BirthMonth == Sign.StartMonth && BirthDay >= Sign.StartDay) ||
                (BirthMonth == Sign.EndMonth && BirthDay <= Sign.EndDay))
            {
                return Sign.Name;
            }
        }
    }

    return TEXT("Unknown");
}

void UTheScopesEngine::CalculateMoonPhase(int32 Year, int32 Month, int32 Day, FString& PhaseName, float& PhasePercent)
{
    // Simple moon phase calculation based on known new moon reference
    // Known new moon: January 6, 2000 at 18:14 UTC
    // Lunar cycle: 29.53059 days
    
    // Calculate days since reference new moon
    int32 DaysSinceRef = 0;
    
    // Simple day count from year 2000
    DaysSinceRef = (Year - 2000) * 365 + (Year - 2000) / 4; // Approximate
    for (int32 m = 1; m < Month; m++)
    {
        if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12)
            DaysSinceRef += 31;
        else if (m == 4 || m == 6 || m == 9 || m == 11)
            DaysSinceRef += 30;
        else if (m == 2)
        {
            if (Year % 4 == 0 && (Year % 100 != 0 || Year % 400 == 0))
                DaysSinceRef += 29;
            else
                DaysSinceRef += 28;
        }
    }
    DaysSinceRef += Day - 6; // Reference day is Jan 6
    
    // Adjust for leap years between 2000 and target year
    int32 LeapDays = (Year - 2000) / 4 - (Year - 2000) / 100 + (Year - 2000) / 400;
    DaysSinceRef += LeapDays;
    
    // Calculate position in lunar cycle
    const float LunarCycle = 29.53059f;
    float CyclePosition = FMath::Fmod((float)DaysSinceRef, LunarCycle);
    if (CyclePosition < 0) CyclePosition += LunarCycle;
    
    PhasePercent = CyclePosition / LunarCycle;
    
    // Determine phase name
    float Phase = PhasePercent * 8.0f;
    if (Phase < 0.5f || Phase >= 7.5f)
        PhaseName = TEXT("New Moon");
    else if (Phase < 1.5f)
        PhaseName = TEXT("Waxing Crescent");
    else if (Phase < 2.5f)
        PhaseName = TEXT("First Quarter");
    else if (Phase < 3.5f)
        PhaseName = TEXT("Waxing Gibbous");
    else if (Phase < 4.5f)
        PhaseName = TEXT("Full Moon");
    else if (Phase < 5.5f)
        PhaseName = TEXT("Waning Gibbous");
    else if (Phase < 6.5f)
        PhaseName = TEXT("Last Quarter");
    else
        PhaseName = TEXT("Waning Crescent");
}

int32 UTheScopesEngine::ReduceToSingleDigit(int32 Number)
{
    while (Number > 9 && Number != 11 && Number != 22 && Number != 33)
    {
        int32 Sum = 0;
        while (Number > 0)
        {
            Sum += Number % 10;
            Number /= 10;
        }
        Number = Sum;
    }
    return Number;
}

int32 UTheScopesEngine::GetLetterValue(TCHAR Letter)
{
    Letter = FChar::ToUpper(Letter);
    if (Letter < 'A' || Letter > 'Z') return 0;
    
    int32 Value = (Letter - 'A') % 9 + 1;
    return Value;
}

bool UTheScopesEngine::IsVowel(TCHAR Letter)
{
    Letter = FChar::ToUpper(Letter);
    return Letter == 'A' || Letter == 'E' || Letter == 'I' || Letter == 'O' || Letter == 'U';
}

void UTheScopesEngine::CalculateLifePath(const FString& BirthDate, int32& LifePathNumber, FString& Interpretation)
{
    // Parse birth date (YYYY-MM-DD format)
    TArray<FString> Parts;
    BirthDate.ParseIntoArray(Parts, TEXT("-"), true);
    
    if (Parts.Num() != 3)
    {
        LifePathNumber = 0;
        Interpretation = TEXT("Invalid date format. Use YYYY-MM-DD.");
        return;
    }
    
    int32 Year = FCString::Atoi(*Parts[0]);
    int32 Month = FCString::Atoi(*Parts[1]);
    int32 Day = FCString::Atoi(*Parts[2]);
    
    // Reduce each component
    int32 YearSum = ReduceToSingleDigit(Year);
    int32 MonthSum = ReduceToSingleDigit(Month);
    int32 DaySum = ReduceToSingleDigit(Day);
    
    // Add together and reduce
    LifePathNumber = ReduceToSingleDigit(YearSum + MonthSum + DaySum);
    
    // Interpretations
    switch (LifePathNumber)
    {
        case 1: Interpretation = TEXT("The Leader - Independent, ambitious, innovative"); break;
        case 2: Interpretation = TEXT("The Peacemaker - Cooperative, diplomatic, sensitive"); break;
        case 3: Interpretation = TEXT("The Communicator - Creative, expressive, optimistic"); break;
        case 4: Interpretation = TEXT("The Builder - Practical, disciplined, hardworking"); break;
        case 5: Interpretation = TEXT("The Adventurer - Freedom-loving, versatile, curious"); break;
        case 6: Interpretation = TEXT("The Nurturer - Responsible, caring, harmonious"); break;
        case 7: Interpretation = TEXT("The Seeker - Analytical, spiritual, introspective"); break;
        case 8: Interpretation = TEXT("The Achiever - Ambitious, powerful, material-focused"); break;
        case 9: Interpretation = TEXT("The Humanitarian - Compassionate, idealistic, generous"); break;
        case 11: Interpretation = TEXT("The Master Intuitive - Spiritual insight, inspiration"); break;
        case 22: Interpretation = TEXT("The Master Builder - Visionary, practical idealism"); break;
        case 33: Interpretation = TEXT("The Master Teacher - Compassion, spiritual guidance"); break;
        default: Interpretation = TEXT("Unique path"); break;
    }
}

void UTheScopesEngine::CalculateExpressionNumber(const FString& FullName, int32& ExpressionNumber, FString& Interpretation)
{
    int32 Total = 0;
    
    for (TCHAR Char : FullName)
    {
        if (FChar::IsAlpha(Char))
        {
            Total += GetLetterValue(Char);
        }
    }
    
    ExpressionNumber = ReduceToSingleDigit(Total);
    
    switch (ExpressionNumber)
    {
        case 1: Interpretation = TEXT("Natural leader, independent, creative vision"); break;
        case 2: Interpretation = TEXT("Diplomatic, cooperative, harmony-seeking"); break;
        case 3: Interpretation = TEXT("Creative expression, communication, joy"); break;
        case 4: Interpretation = TEXT("Practical builder, organized, reliable"); break;
        case 5: Interpretation = TEXT("Versatile, adventurous, freedom of expression"); break;
        case 6: Interpretation = TEXT("Nurturing, responsible, beauty-loving"); break;
        case 7: Interpretation = TEXT("Analytical, spiritual depth, introspective"); break;
        case 8: Interpretation = TEXT("Ambitious, material success, authority"); break;
        case 9: Interpretation = TEXT("Humanitarian, compassionate, global vision"); break;
        default: Interpretation = TEXT("Unique expression"); break;
    }
}

void UTheScopesEngine::CalculateSoulUrge(const FString& FullName, int32& SoulUrgeNumber, FString& Interpretation)
{
    int32 Total = 0;
    
    for (TCHAR Char : FullName)
    {
        if (IsVowel(Char))
        {
            Total += GetLetterValue(Char);
        }
    }
    
    SoulUrgeNumber = ReduceToSingleDigit(Total);
    
    switch (SoulUrgeNumber)
    {
        case 1: Interpretation = TEXT("Desires independence and personal achievement"); break;
        case 2: Interpretation = TEXT("Desires partnership and emotional harmony"); break;
        case 3: Interpretation = TEXT("Desires creative expression and joy"); break;
        case 4: Interpretation = TEXT("Desires stability, order, and security"); break;
        case 5: Interpretation = TEXT("Desires freedom, adventure, and variety"); break;
        case 6: Interpretation = TEXT("Desires love, family, and responsibility"); break;
        case 7: Interpretation = TEXT("Desires spiritual understanding and solitude"); break;
        case 8: Interpretation = TEXT("Desires material success and recognition"); break;
        case 9: Interpretation = TEXT("Desires to serve humanity and make a difference"); break;
        default: Interpretation = TEXT("Unique soul desire"); break;
    }
}

void UTheScopesEngine::CalculateBiorhythm(int32 DaysAlive, float& Physical, float& Emotional, float& Intellectual)
{
    const float PI = 3.14159265358979f;
    
    // Biorhythm cycles:
    // Physical: 23 days
    // Emotional: 28 days
    // Intellectual: 33 days
    
    // Calculate using sine wave: sin(2 * PI * daysAlive / cycleLength)
    Physical = FMath::Sin(2.0f * PI * (float)DaysAlive / 23.0f) * 100.0f;
    Emotional = FMath::Sin(2.0f * PI * (float)DaysAlive / 28.0f) * 100.0f;
    Intellectual = FMath::Sin(2.0f * PI * (float)DaysAlive / 33.0f) * 100.0f;
}
