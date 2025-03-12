module Types
  class BookmarkType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :url, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
