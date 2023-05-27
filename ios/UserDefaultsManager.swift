import Foundation

@objc(UserDefaultsManager)
class UserDefaultsManager: NSObject {
  
  @objc(set:forKey:)
  func set(_ value: String, forKey key: String) {
    let userDefaults = UserDefaults(suiteName: "group.readblogs")
    userDefaults?.set(value, forKey: key)
    userDefaults?.synchronize()
  }

  @objc(saveBlogs:)
    func saveBlogs(_ blogs: [String]) {
        let userDefaults = UserDefaults(suiteName: "group.readblogs")
        userDefaults?.set(blogs, forKey: "blogs")
        userDefaults?.synchronize()
    }

  @objc(fetchBlogs)
  func fetchBlogs() -> [String]? {
    let userDefaults = UserDefaults(suiteName: "group.readblogs")
    return userDefaults?.array(forKey: "blogs") as? [String]
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
