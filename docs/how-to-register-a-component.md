# How to register a component and define service dependency and RTO

## Register a new service(component)

You need the following things to register a component

* A repository on GitHub or Gitlab 
* A file name `catalog-info.yaml` in the root of the repository 

### Define your `catalog-info.yaml` file

Create the `catalog-info.yaml` file and set the values of kind (`Component`) name, description, type(`service`), lifecycle and owner

```yml
apiVersion:backstage.io/v1alpha1
kind: Component
metadata:
    name: name-of-service
    description: Short description of your service
spec:
    type: service
    lifecycle: development or production
    owner: name_of_team or individual # Use an underscore to separate words for your team name
```

A minimal repository with an example can be found here:
:TODO: Add example repo


### Register the component in Backstage

1. Click Create and then go to [Register an existing component]()
section, paste the URL of the `catalog.yml` file in your repository
(E.g. ``)
1. Click **ANALYZE**, review and confirm the import with the button **IMPORT**.
2. Your component configuration will be imported.


!!! success
    Your component should be now available in the [Catalog home](https://).


