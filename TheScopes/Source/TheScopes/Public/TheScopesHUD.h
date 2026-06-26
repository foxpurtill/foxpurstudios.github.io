#pragma once

#include "CoreMinimal.h"
#include "GameFramework/HUD.h"
#include "TheScopesHUD.generated.h"

UCLASS()
class THE_SCOPES_API ATheScopesHUD : public AHUD
{
    GENERATED_BODY()

public:
    ATheScopesHUD();

    virtual void BeginPlay() override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "The Scopes")
    TSubclassOf<UUserWidget> WidgetClass;

    UPROPERTY(BlueprintReadOnly, Category = "The Scopes")
    UUserWidget* WidgetInstance;

protected:
    UFUNCTION(BlueprintCallable, Category = "The Scopes")
    void CreateAndDisplayWidget();
};
