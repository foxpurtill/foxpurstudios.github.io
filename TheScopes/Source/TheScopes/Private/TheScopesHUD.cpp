#include "TheScopesHUD.h"
#include "Blueprint/UserWidget.h"
#include "Kismet/GameplayStatics.h"

ATheScopesHUD::ATheScopesHUD()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ATheScopesHUD::BeginPlay()
{
    Super::BeginPlay();
    CreateAndDisplayWidget();
}

void ATheScopesHUD::CreateAndDisplayWidget()
{
    // If no widget class is set, try to load the default
    if (!WidgetClass)
    {
        WidgetClass = LoadClass<UUserWidget>(nullptr, TEXT("/Game/UI/TheScopes_MainUI.TheScopes_MainUI_C"));
    }

    if (!WidgetClass)
    {
        UE_LOG(LogTemp, Error, TEXT("TheScopesHUD: WidgetClass is null. Set it in the Blueprint or Details panel."));
        return;
    }

    APlayerController* PC = GetOwningPlayerController();
    if (!PC)
    {
        UE_LOG(LogTemp, Warning, TEXT("TheScopesHUD: No PlayerController found. Retrying in 0.5s..."));
        FTimerHandle TimerHandle;
        GetWorldTimerManager().SetTimer(TimerHandle, this, &ATheScopesHUD::CreateAndDisplayWidget, 0.5f, false);
        return;
    }

    WidgetInstance = CreateWidget<UUserWidget>(PC, WidgetClass);
    if (WidgetInstance)
    {
        WidgetInstance->AddToViewport(0);
        UE_LOG(LogTemp, Log, TEXT("TheScopesHUD: Widget created and added to viewport."));
    }
    else
    {
        UE_LOG(LogTemp, Error, TEXT("TheScopesHUD: Failed to create widget instance."));
    }
}
