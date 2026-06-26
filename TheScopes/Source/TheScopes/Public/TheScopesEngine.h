#pragma once

#include "CoreMinimal.h"
#include "Kismet/BlueprintFunctionLibrary.h"
#include "TheScopesEngine.generated.h"

UCLASS()
class THE_SCOPES_API UTheScopesEngine : public UBlueprintFunctionLibrary
{
    GENERATED_BODY()

public:
    // Astrology: Calculate sun sign from birth month and day
    UFUNCTION(BlueprintCallable, Category = "The Scopes|Astrology")
    static FString CalculateSunSign(int32 BirthMonth, int32 BirthDay);

    // Astrology: Calculate moon phase name and percentage
    UFUNCTION(BlueprintCallable, Category = "The Scopes|Astrology")
    static void CalculateMoonPhase(int32 Year, int32 Month, int32 Day, FString& PhaseName, float& PhasePercent);

    // Numerology: Calculate life path number from birth date string (YYYY-MM-DD)
    UFUNCTION(BlueprintCallable, Category = "The Scopes|Numerology")
    static void CalculateLifePath(const FString& BirthDate, int32& LifePathNumber, FString& Interpretation);

    // Numerology: Calculate expression number from full name
    UFUNCTION(BlueprintCallable, Category = "The Scopes|Numerology")
    static void CalculateExpressionNumber(const FString& FullName, int32& ExpressionNumber, FString& Interpretation);

    // Numerology: Calculate soul urge number from full name
    UFUNCTION(BlueprintCallable, Category = "The Scopes|Numerology")
    static void CalculateSoulUrge(const FString& FullName, int32& SoulUrgeNumber, FString& Interpretation);

    // Biorhythm: Calculate physical, emotional, intellectual cycles
    UFUNCTION(BlueprintCallable, Category = "The Scopes|Biorhythm")
    static void CalculateBiorhythm(int32 DaysAlive, float& Physical, float& Emotional, float& Intellectual);

private:
    // Helper: Reduce a number to single digit (or master number)
    static int32 ReduceToSingleDigit(int32 Number);
    
    // Helper: Get numeric value of a letter (A=1, B=2, ... I=9, J=1, etc.)
    static int32 GetLetterValue(TCHAR Letter);
    
    // Helper: Is this a vowel?
    static bool IsVowel(TCHAR Letter);
};
