# How to publish your documentation

You need the following things prepared to document a component:

* A [registered component](./how-to-register-a-component.md) (You can also do
both setups, registration of the component and the documentation together in
one go).

## Set the configuration file for MkDocs

* A file named `mkdocs.yml` in the root of the repository.

!!! example "mkdocs.yml file with techdocs configuration"

    ```yaml
    site_name: Publish Documentation Example
    docs_dir: docs
    plugins:
    - techdocs-core
    ```

## Add annotation for documentation

You need to create the definition `annotations:` inside the `metadata:` section
of your component and add the key `backstage.io/techdocs-ref` annotation in the
`catalog-info.yaml` file.

!!! example "catalog-info.yaml file with techdocs information"

    ```yaml
    apiVersion: backstage.io/v1alpha1
    kind: Component
    metadata:
      #...
      annotations:
        backstage.io/techdocs-ref: dir:.
      #...
    ```

## Add documentation

Create a directory called `docs`, define a file called `index.md` or `readme.md`,
this will be the main page of your documentation.

Inside this you can `docs` directory you should be able to use Markdown files
`*.md` to define your documentation.

### Formatting and capabilities

Documentation is formatted mainly using [MkDocs syntax](https://www.mkdocs.org/user-guide/writing-your-docs/),
also with [Material for MkDocs features](https://squidfunk.github.io/mkdocs-material/reference/)
and some specific features added to [Backstage](https://backstage.io/) as
plugins.


## References

* [TechDocs Documentation in Backstage](https://backstage.io/docs/features/techdocs/)