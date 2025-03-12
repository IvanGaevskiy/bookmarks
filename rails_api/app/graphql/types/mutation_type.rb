# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :delete_bookmark, mutation: Mutations::DeleteBookmark
    field :create_bookmark, mutation: Mutations::CreateBookmark
  end
end
