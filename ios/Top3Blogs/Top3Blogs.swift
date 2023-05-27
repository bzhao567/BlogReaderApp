import WidgetKit
import SwiftUI

struct Blog: Codable, Identifiable, Hashable {
    var id: Int
    var title: String
    var author: String
    var date: String
    var content: String
    var authorBio: String
}

struct BlogEntry: TimelineEntry {
    let date: Date
    let blogs: [Blog]
}

struct BlogView: View {
    let url: String
    let title: String
    
    init(blog: Blog) {
        self.url = "blogreaderapp://blog/\(blog.id)"
        self.title = blog.title
        print(self.url)
    }
    
    var body: some View {
        Link(destination: URL(string: self.url)!) {
            Text(self.title)
                .font(.footnote)  // Adjust the font size here.
                .padding(5)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(5)
          }
      }
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> BlogEntry {
        BlogEntry(date: Date(), blogs: [])
    }

    func getSnapshot(in context: Context, completion: @escaping (BlogEntry) -> ()) {
        let entry = BlogEntry(date: Date(), blogs: loadBlogs())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [BlogEntry] = []
        let currentDate = Date()
        let entry = BlogEntry(date: currentDate, blogs: loadBlogs())
        entries.append(entry)

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
    
    func loadBlogs() -> [Blog] {
        let userDefaults = UserDefaults(suiteName: "group.readblogs")
        guard let blogsStrings = userDefaults?.array(forKey: "blogs") as? [String] else {
            return []
        }
        let blogs = blogsStrings.compactMap { blogString in
            try? JSONDecoder().decode(Blog.self, from: Data(blogString.utf8))
        }
        return blogs
    }
}

struct PlaceholderView : View {
    var body: some View {
        Text("Loading...")
    }
}

struct Top3BlogsWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        VStack(alignment: .leading) {
            Text("Top Blogs")  // Add the title at the top of the widget
                .font(.title2)
            ForEach(entry.blogs.prefix(3), id: \.self) { blog in
                BlogView(blog: blog)
            }
        }
    }
}

struct Top3Blogs: Widget {
    private let kind: String = "Top3Blogs"

    public var body: some WidgetConfiguration {
      StaticConfiguration(kind: kind, provider: Provider()) { entry in
          Top3BlogsWidgetEntryView(entry: entry)
      }
    .configurationDisplayName("Top 3 Blogs")
    .description("This widget will show the top 3 blogs.")
    .supportedFamilies([.systemMedium])
    }
}
