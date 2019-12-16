This Azure Function fetches the lunch menu from deg16.no and publish it to a channel in Teams, specified by an environmental variable called `TEAMS_URL`.

## Prerequisites

- Azure subscription
- Azure CLI
- [azure-function-core-tools](https://github.com/Azure/azure-functions-core-tools)

### Setup Functions app in Azure

```bash
az group create --name deg16-lunchmenu-rg --location westeurope

az storage account create \
--name deg16lunchmenusa \
--location westeurope \
--resource-group deg16-lunchmenu-rg \
--sku Standard_LRS

az functionapp create \
--name deg16-lunchmenu \
--resource-group deg16-lunchmenu-rg \
--consumption-plan-location westeurope \
--storage-account deg16lunchmenusa \
--runtime javascript
```

### Deploy application

```bash
git clone https://github.com/madsaune/azure-fn-deg16-lunchmenu.git
cd azure-fn-deg16-lunchmenu

func azure functionapp publish deg16-lunchmenu
```
